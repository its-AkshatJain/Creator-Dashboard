import { useState, useEffect } from "react";
import axios from "axios";
import {
  BookmarkIcon,
  ShareIcon,
  FlagIcon,
} from "@heroicons/react/24/outline";

const Feed = () => {
  const [feed, setFeed] = useState([]);

  const handleSave = (post) => alert(`Saved: ${post.title || post.content}`);
  const handleShare = (url) =>
    navigator.clipboard.writeText(url).then(() => alert("Link copied to clipboard!"));
  const handleReport = (post) => alert(`Reported post: ${post.title || post.content}`);

  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        const [redditRes, twitterRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_SERVER_URL}/api/feed/reddit`),
          axios.get(`${import.meta.env.VITE_SERVER_URL}/api/feed/twitter`),
        ]);

        // map Reddit posts (flat objects)
        const reddit = redditRes.data.map((post) => ({
          id: post.id,
          platform: "Reddit",
          name: post.author,
          title: post.title,
          content: post.content,
          created_at: post.created_at,
          url: post.url,
          profile_image_url: post.image || "/reddit-icon.png",
          metrics: post.metrics,
        }));

        // map Twitter posts (flat objects)
        const twitter = twitterRes.data.map((post) => ({
          id: post.id,
          platform: "Twitter",
          name: post.name,
          title: null,
          content: post.content,
          created_at: post.created_at,
          url: post.url,
          profile_image_url: post.profile_image_url || "/twitter-icon.png",
          metrics: post.metrics,
        }));

        // combine & shuffle
        const combined = [...reddit, ...twitter].sort(() => 0.5 - Math.random());
        setFeed(combined);
      } catch (err) {
        console.error("Feed loading error:", err);
      }
    };

    fetchFeedData();
  }, []);

  const renderActions = (url, post) => (
    <div className="flex gap-4 mt-4 text-gray-500">
      <button onClick={() => handleSave(post)} title="Save">
        <BookmarkIcon className="h-5 w-5 hover:text-blue-600" />
      </button>
      <button onClick={() => handleShare(url)} title="Share">
        <ShareIcon className="h-5 w-5 hover:text-green-600" />
      </button>
      <button onClick={() => handleReport(post)} title="Report">
        <FlagIcon className="h-5 w-5 hover:text-red-600" />
      </button>
    </div>
  );

  const renderPostCard = (post) => (
    <div
      className="bg-white border rounded-lg p-5 shadow hover:shadow-lg transition-all"
      key={post.platform + "-" + post.id}
    >
      <div className="flex items-center gap-3 mb-3">
        {post.profile_image_url && (
          <img
            src={post.profile_image_url}
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
        )}
        <div>
          <h4 className="font-semibold">
            {post.name}{" "}
            <span className="text-sm text-gray-400">• {post.platform}</span>
          </h4>
          {post.created_at && (
            <p className="text-xs text-gray-500">
              {new Date(post.created_at).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {post.title && (
        <h3 className="text-lg font-bold mb-2">{post.title}</h3>
      )}
      <p className="text-gray-700 whitespace-pre-line">{post.content}</p>

      {post.metrics && (
        <div className="flex gap-6 mt-4 text-sm text-gray-600">
          {"score" in post.metrics && <p>★ {post.metrics.score}</p>}
          {"comments" in post.metrics && <p>💬 {post.metrics.comments}</p>}
          {"like_count" in post.metrics && <p>❤️ {post.metrics.like_count}</p>}
          {"reply_count" in post.metrics && <p>💬 {post.metrics.reply_count}</p>}
          {"retweet_count" in post.metrics && <p>🔁 {post.metrics.retweet_count}</p>}
        </div>
      )}

      {renderActions(post.url, post)}
    </div>
  );

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {feed.map((post) => renderPostCard(post))}
    </div>
  );
};

export default Feed;
