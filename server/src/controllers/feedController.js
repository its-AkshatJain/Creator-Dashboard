import axios from 'axios';
import fs from 'fs';
import path from 'path';

// =============== REDDIT AUTH ===============
const getRedditAppAccessToken = async () => {
  try {
    const credentials = Buffer.from(
      `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`
    ).toString('base64');

    const response = await axios.post(
      'https://www.reddit.com/api/v1/access_token',
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': process.env.REDDIT_USER_AGENT || 'CreatorDash/1.0',
        },
      }
    );

    return response.data.access_token;
  } catch (err) {
    console.error("❌ Error fetching Reddit access token:");
    console.error("Status:", err.response?.status);

    if (err.response) {
      const contentType = err.response.headers['content-type'];
      const isJSON = contentType && contentType.includes('application/json');
    
      console.error('❌ Reddit API Error');
      console.error('Status:', err.response.status);
      console.error('Headers:', err.response.headers);
      if (isJSON) {
        console.error('Data:', err.response.data);
      } else {
        console.error('Non-JSON response body omitted from logs');
      }
    } else {
      console.error('❌ Request failed without response:', err.message);
    }
    
    throw err;
  }
};

// =============== REDDIT POSTS ===============
export const fetchRedditPosts = async (req, res) => {
  try {
    const after = req.query.after || null;
    const userAgent = process.env.REDDIT_USER_AGENT || 'CreatorDash/1.0';

    // 🔐 Get OAuth token
    const token = await getRedditAppAccessToken();

    const response = await axios.get('https://oauth.reddit.com/r/all/top', {
      params: {
        limit: 10,
        after: after,
      },
      headers: {
        'User-Agent': userAgent,
        'Authorization': `Bearer ${token}`,
      },
    });

    // Check if response is JSON
    const contentType = response.headers['content-type'];
    if (!contentType?.includes('application/json')) {
      console.error('❌ Reddit API returned non-JSON:', contentType);
      return res.status(502).json({ error: 'Reddit API returned non-JSON response' });
    }

    if (!response.data?.data?.children) {
      return res.status(500).json({ error: 'Unexpected Reddit API structure' });
    }

    const posts = response.data.data.children.map((item) => ({
      id: item.data.id,
      platform: 'Reddit',
      title: item.data.title,
      content: item.data.selftext,
      author: item.data.author,
      url: `https://www.reddit.com${item.data.permalink}`,
      image: item.data.thumbnail?.startsWith('http') ? item.data.thumbnail : null,
      created_at: new Date(item.data.created_utc * 1000).toISOString(),
      metrics: {
        score: item.data.score,
        comments: item.data.num_comments,
      },
    }));

    res.json({
      posts,
      after: response.data.data.after,
    });
  } catch (err) {
    console.warn('⚠️ Reddit API failed:', err.message);

    const fallbackFile = path.resolve(process.cwd(), 'data', 'sampleReddit.json');
    console.log('Using fallback file at:', fallbackFile);

    try {
      const fallbackData = JSON.parse(fs.readFileSync(fallbackFile, 'utf-8'));
      return res.json(fallbackData);
    } catch (readErr) {
      console.error('❌ Fallback data file not found or invalid:', readErr.message);
      return res.status(500).json({ error: 'Reddit API and fallback both failed' });
    }
  }
};

// =============== TWITTER POSTS ===============
export const fetchTwitterPosts = async (req, res) => {
  try {
    const response = await axios.get('https://api.twitter.com/2/tweets/search/recent', {
      params: {
        query: 'elon musk',
        max_results: 10,
        'tweet.fields': 'created_at,public_metrics',
        'expansions': 'author_id',
        'user.fields': 'username,name,profile_image_url'
      },
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    });

    if (!response.data?.data) {
      throw new Error('No tweets found');
    }

    // Build a map of users
    const usersMap = (response.data.includes?.users || [])
      .reduce((acc, u) => ((acc[u.id] = u), acc), {});

    const tweets = response.data.data.map((tweet) => {
      const user = usersMap[tweet.author_id] || {};
      return {
        id: tweet.id,
        platform: 'Twitter',
        name: user.name || user.username || 'Unknown',
        content: tweet.text,
        created_at: tweet.created_at,
        profile_image_url: user.profile_image_url || '/default-avatar.png',
        url: `https://twitter.com/i/web/status/${tweet.id}`,
        metrics: tweet.public_metrics
      };
    });

    res.json(tweets);
  } catch (err) {
    console.warn('⚠️ Twitter API failed:', err.message);

    const fallbackFile = path.resolve(process.cwd(), 'data', 'sampleTwitter.json');
    console.log('Using fallback file at:', fallbackFile);

    try {
      const fallbackData = JSON.parse(fs.readFileSync(fallbackFile, 'utf-8'));
      return res.json(fallbackData);
    } catch (readErr) {
      console.error('❌ Fallback data file not found or invalid:', readErr.message);
      return res.status(500).json({ error: 'Twitter API and fallback both failed' });
    }
  }
};
