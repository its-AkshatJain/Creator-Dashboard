import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookmarkIcon,
  ShareIcon,
  FlagIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

export default function Feed() {
  const { darkMode } = useTheme();
  const [feed, setFeed] = useState([]);
  const [after, setAfter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadedPosts, setLoadedPosts] = useState([]);
  const token = localStorage.getItem("token");

  const skeletonCount = 6;

  useEffect(() => {
    async function loadFeed() {
      setIsLoading(true);
      try {
        const [redditRes, twitterRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_SERVER_URL}/api/feed/reddit`),
          axios.get(`${import.meta.env.VITE_SERVER_URL}/api/feed/twitter`),
        ]);

        const redditPosts = redditRes.data.posts.map((post) => ({
          ...post,
          uniqueId: `reddit-${post.id}`,
        }));
        const twitterPosts = twitterRes.data.map((post) => ({
          ...post,
          uniqueId: `twitter-${post.id}`,
        }));

        const combined = [...redditPosts, ...twitterPosts].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setAfter(redditRes.data.after);
        setFeed(combined);

        let loaded = [];
        const chunkSize = Math.ceil(combined.length / 3);

        loaded = combined.slice(0, chunkSize);
        setLoadedPosts(loaded);

        setTimeout(() => {
          loaded = [...loaded, ...combined.slice(chunkSize, chunkSize * 2)];
          setLoadedPosts(loaded);

          setTimeout(() => {
            setLoadedPosts(combined);
            setIsLoading(false);
          }, 400);
        }, 300);
      } catch (err) {
        console.error("Feed loading error:", err);
        toast.error("Failed to load feed");
        setIsLoading(false);
      }
    }

    loadFeed();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
        !loadingMore &&
        after
      ) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [after, loadingMore]);

  const loadMore = async () => {
    if (loadingMore || !after) return;

    setLoadingMore(true);
    try {
      const redditRes = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/feed/reddit`, {
        params: { after },
      });

      const newPosts = redditRes.data.posts.map((post) => ({
        ...post,
        uniqueId: `reddit-${post.id}`,
      }));

      setAfter(redditRes.data.after);
      const updatedFeed = [...feed, ...newPosts].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setFeed(updatedFeed);
      setLoadedPosts(updatedFeed);
    } catch (err) {
      console.error("Error loading more Reddit posts:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSave = async (post) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/users/save`,
        { post },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Saved (+2 credits). You now have ${data.credits} credits.`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    }
  };

  const handleReport = async (post) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/users/report`,
        { post },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.info(`Reported (+1 credit). You now have ${data.credits} credits.`);
    } catch {
      toast.error("Report failed");
    }
  };

  const handleShare = (url) =>
    navigator.clipboard.writeText(url).then(() => toast.info("Link copied"));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Skeleton animation
  const skeletonPulse = {
    initial: { opacity: 0.6 },
    animate: { 
      opacity: [0.6, 0.8, 0.6],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "easeInOut"
      }
    }
  };

  // Floating elements for visual interest
  const floatingElements = [
    { size: "w-40 h-40", delay: 0, duration: 20, position: "top-20 -left-20" },
    { size: "w-64 h-64", delay: 2, duration: 25, position: "bottom-40 -right-32" },
    { size: "w-32 h-32", delay: 1, duration: 15, position: "bottom-10 left-1/4" },
  ];

  // Skeleton card component
  const SkeletonCard = () => (
    <motion.div
      variants={cardVariants}
      className={`backdrop-blur-lg rounded-xl overflow-hidden h-80 ${
        darkMode 
          ? "bg-gray-800/40 border border-gray-700/50 shadow-lg shadow-black/20" 
          : "bg-white/40 border border-white/50 shadow-lg shadow-blue-100/30"
      }`}
    >
      <div className="p-5 h-full">
        <div className="flex items-center mb-4">
          <motion.div 
            variants={skeletonPulse}
            initial="initial"
            animate="animate"
            className={`w-10 h-10 rounded-full ${
              darkMode ? "bg-gray-700" : "bg-gray-200"
            }`}
          />
          <div className="ml-3">
            <motion.div 
              variants={skeletonPulse}
              initial="initial"
              animate="animate"
              className={`h-4 w-32 rounded ${
                darkMode ? "bg-gray-700" : "bg-gray-200"
              }`}
            />
            <motion.div 
              variants={skeletonPulse}
              initial="initial"
              animate="animate"
              className={`h-3 w-24 rounded mt-2 ${
                darkMode ? "bg-gray-700" : "bg-gray-200"
              }`}
            />
          </div>
        </div>
        
        <motion.div 
          variants={skeletonPulse}
          initial="initial"
          animate="animate"
          className={`h-4 w-3/4 rounded mb-2 ${
            darkMode ? "bg-gray-700" : "bg-gray-200"
          }`}
        />
        
        <motion.div 
          variants={skeletonPulse}
          initial="initial"
          animate="animate"
          className={`h-3 w-full rounded mb-2 ${
            darkMode ? "bg-gray-700" : "bg-gray-200"
          }`}
        />
        
        <motion.div 
          variants={skeletonPulse}
          initial="initial"
          animate="animate"
          className={`h-3 w-5/6 rounded mb-2 ${
            darkMode ? "bg-gray-700" : "bg-gray-200"
          }`}
        />
        
        <motion.div 
          variants={skeletonPulse}
          initial="initial"
          animate="animate"
          className={`h-3 w-4/6 rounded mb-2 ${
            darkMode ? "bg-gray-700" : "bg-gray-200"
          }`}
        />
        
        <div className="mt-6 flex space-x-2">
          {[1, 2, 3].map((i) => (
            <motion.div 
              key={i}
              variants={skeletonPulse}
              initial="initial"
              animate="animate"
              className={`h-6 w-16 rounded ${
                darkMode ? "bg-gray-700" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        
        <div className={`flex justify-around mt-8 pt-3 border-t ${
          darkMode ? "border-gray-700" : "border-gray-200"
        }`}>
          {[1, 2, 3].map((i) => (
            <motion.div 
              key={i}
              variants={skeletonPulse}
              initial="initial"
              animate="animate"
              className={`h-8 w-20 rounded-full ${
                darkMode ? "bg-gray-700" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={`min-h-screen py-10 ${
      darkMode
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
        : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800"
    } relative overflow-hidden`}>

      {/* Animated background elements */}
      {floatingElements.map((el, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full blur-3xl opacity-20 ${el.size} ${el.position} ${
            darkMode 
              ? index % 2 === 0 ? "bg-blue-600" : "bg-purple-700"
              : index % 2 === 0 ? "bg-blue-300" : "bg-indigo-300"
          }`}
          animate={{
            y: [0, -40, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut"
          }}
        />
      ))}

      <div className="container mx-auto px-4 relative z-10">
        <motion.h1 
          className={`text-3xl font-bold mb-8 text-center mt-16 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your Personalized Feed
        </motion.h1>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Show actual loaded posts */}
          <AnimatePresence>
            {loadedPosts.map((post) => (
              <motion.div
  key={post.uniqueId}
  layoutId={post.uniqueId}
  variants={cardVariants}
  whileHover={{ y: -5, transition: { duration: 0.2 } }}
  className={`backdrop-blur-lg rounded-xl overflow-hidden cursor-pointer ${
    darkMode 
      ? "bg-gray-800/40 border border-gray-700/50 shadow-lg shadow-black/20" 
      : "bg-white/40 border border-white/50 shadow-lg shadow-blue-100/30"
  } transition-all duration-300`}
>
  <a
    href={post.url}
    target="_blank"
    rel="noopener noreferrer"
    className="block p-5 no-underline hover:no-underline text-inherit"
  >
    {/* Card Content */}
    <div className="flex items-center mb-4">
      <div className={`relative w-10 h-10 rounded-full overflow-hidden mr-3 ${
        darkMode ? "ring-2 ring-gray-700" : "ring-2 ring-gray-200"
      }`}>
        <img
          src={post.profile_image_url}
          className="w-full h-full object-cover"
          alt=""
        />
      </div>
      <div>
        <div className="font-semibold flex items-center">
          {post.name}
          <span className={`text-xs ml-2 px-2 py-1 rounded-full ${
            darkMode 
              ? "bg-gray-700 text-gray-300" 
              : "bg-gray-200 text-gray-600"
          }`}>
            {post.platform}
          </span>
        </div>
        <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          {new Date(post.created_at).toLocaleString()}
        </div>
      </div>
    </div>

    <div className={`mb-4 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
      {post.title && (
        <h3 className="font-bold text-lg mb-2">{post.title}</h3>
      )}
      <p className="whitespace-pre-line line-clamp-4">{post.content}</p>
    </div>

    {post.metrics && (
      <div className={`flex flex-wrap gap-3 my-3 px-3 py-2 rounded-lg ${
        darkMode ? "bg-gray-700/40" : "bg-gray-100/60"
      }`}>
        {"score" in post.metrics && (
          <span className="flex items-center">
            <span className="mr-1">★</span> {post.metrics.score}
          </span>
        )}
        {"comments" in post.metrics && (
          <span className="flex items-center">
            <span className="mr-1">💬</span> {post.metrics.comments}
          </span>
        )}
        {"like_count" in post.metrics && (
          <span className="flex items-center">
            <span className="mr-1">❤️</span> {post.metrics.like_count}
          </span>
        )}
        {"reply_count" in post.metrics && (
          <span className="flex items-center">
            <span className="mr-1">💬</span> {post.metrics.reply_count}
          </span>
        )}
        {"retweet_count" in post.metrics && (
          <span className="flex items-center">
            <span className="mr-1">🔁</span> {post.metrics.retweet_count}
          </span>
        )}
      </div>
    )}
  </a>

  {/* Post actions remain outside the link to avoid accidental clicks */}
  <div className={`flex justify-around mt-4 pt-3 border-t ${
    darkMode ? "border-gray-700" : "border-gray-200"
  }`}>
    <motion.button 
      onClick={() => handleSave(post)} 
      title="Save"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`flex items-center gap-1 px-3 py-1 rounded-full ${
        darkMode 
          ? "hover:bg-gray-700/70 text-blue-400 hover:text-blue-300" 
          : "hover:bg-gray-100/70 text-blue-600 hover:text-blue-700"
      }`}
    >
      <BookmarkIcon className="w-5 h-5" />
      <span className="text-sm">Save</span>
    </motion.button>
    <motion.button 
      onClick={() => handleShare(post.url)} 
      title="Share"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`flex items-center gap-1 px-3 py-1 rounded-full ${
        darkMode 
          ? "hover:bg-gray-700/70 text-green-400 hover:text-green-300" 
          : "hover:bg-gray-100/70 text-green-600 hover:text-green-700"
      }`}
    >
      <ShareIcon className="w-5 h-5" />
      <span className="text-sm">Share</span>
    </motion.button>
    <motion.button 
      onClick={() => handleReport(post)} 
      title="Report"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`flex items-center gap-1 px-3 py-1 rounded-full ${
        darkMode 
          ? "hover:bg-gray-700/70 text-red-400 hover:text-red-300" 
          : "hover:bg-gray-100/70 text-red-600 hover:text-red-700"
      }`}
    >
      <FlagIcon className="w-5 h-5" />
      <span className="text-sm">Report</span>
    </motion.button>
  </div>
</motion.div>

            ))}
          </AnimatePresence>

          {/* Show skeleton cards for remaining empty spaces */}
          {isLoading && Array.from({ length: skeletonCount - loadedPosts.length }).map((_, index) => (
            index < (skeletonCount - loadedPosts.length) && (
              <SkeletonCard key={`skeleton-${index}`} />
            )
          ))}
        </motion.div>
        
        {/* Show loading spinner at the bottom if more posts are coming */}
        {isLoading && loadedPosts.length > 0 && loadedPosts.length < feed.length && (
          <div className="flex justify-center mt-8">
            <motion.div
              className={`w-8 h-8 rounded-full border-2 ${
                darkMode ? "border-blue-500 border-t-transparent" : "border-indigo-600 border-t-transparent"
              }`}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}
        
        {/* Empty state when no posts are available */}
        {!isLoading && loadedPosts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center p-10 rounded-xl backdrop-blur-md ${
              darkMode 
                ? "bg-gray-800/30 border border-gray-700" 
                : "bg-white/30 border border-gray-200"
            }`}
          >
            <h3 className="text-xl font-semibold mb-2">No posts available</h3>
            <p>Check back later for new content</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}