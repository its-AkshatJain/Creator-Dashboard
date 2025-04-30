import axios from 'axios';
import fs from 'fs';
import path from 'path';

// =============== REDDIT =============== 
export const fetchRedditPosts = async (req, res) => {
  try {
    console.log('Fetching Reddit posts...');
    const userAgent = process.env.REDDIT_USER_AGENT || 'web:myapp:v1.0.0 (by /u/yourusername)';
    
    // Log the API request parameters
    console.log('Sending request to Reddit API with headers:', { 'User-Agent': userAgent });
    
    const response = await axios.get('https://www.reddit.com/r/all/top.json', {
      params: { limit: 10 },
      headers: { 'User-Agent': userAgent }
    });

    // Log the status code and response data (for debugging)
    console.log('Reddit API response status:', response.status);
    console.log('Reddit API response data:', response.data);

    if (!response.data?.data?.children) {
      console.error('Reddit API response does not contain expected "children" data');
      return res.status(500).json({ error: 'Unexpected Reddit API response' });
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
        comments: item.data.num_comments
      }
    }));

    // Log the number of posts retrieved
    console.log(`Successfully fetched ${posts.length} Reddit posts`);

    res.json(posts);
  } catch (err) {
    console.error('Error fetching Reddit posts:', err.message);

    // Additional log to capture the full error details
    console.error('Error details:', err);

    res.status(500).json({ error: 'Failed to fetch posts from Reddit' });
  }
};

// =============== TWITTER =============== 
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
    console.warn('Twitter API failed:', err.message);

    // absolute path to your fallback file
    const fallbackFile = path.resolve(process.cwd(), 'data', 'sampleTwitter.json');
    try {
      const fallbackData = JSON.parse(fs.readFileSync(fallbackFile, 'utf-8'));
      return res.json(fallbackData);
    } catch (readErr) {
      console.error('Fallback data file not found or invalid JSON:', readErr.message);
      return res.status(500).json({ error: 'Twitter API and fallback both failed' });
    }
  }
};
