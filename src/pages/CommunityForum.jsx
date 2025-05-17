import { useEffect, useState } from "react";
import "../styles/communityForum.css";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

function CommunityForum() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const [userType, setUserType] = useState("");
  console.log("Logged-in user:", user);

  useEffect(() => {
    if (user) {
      setUserType(user.userType); // 'farmer', 'customer', etc.
    }
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, "farmerforum"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const forumPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(forumPosts);
    } catch (error) {
      console.error("Error fetching forum posts:", error);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;

    try {
      const postRef = await addDoc(collection(db, "farmerforum"), {
        farmer_id: user.id,
        author: user.name,
        title: newPost.title,
        content: newPost.content,
        timestamp: serverTimestamp(),
        likes: 0,
        comments: [],
      });
      setNewPost({ title: "", content: "" });
      fetchPosts(); // Refresh list
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  const handleLike = async (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, likes: (post.likes || 0) + 1 } : post
      )
    );
    // Note: You can update likes in Firestore too if needed
  };

  return (
    <div className="community-forum">
      <h2>Community Forum</h2>

      {/* Show form only to Farmers */}
      {userType === "farmer" && (
        <div className="new-post-form">
          <h3>Create a Post</h3>
          <input
            type="text"
            placeholder="Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <textarea
            placeholder="What's on your mind?"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          />
          <button onClick={handlePostSubmit}>Post</button>
        </div>
      )}

      {/* Forum Posts */}
      <div className="post-list">
        {posts.length === 0 ? (
          <p>No posts yet. Be the first to post!</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p className="post-author">by {post.author}</p>
              <p>{post.content}</p>
              <div className="post-actions">
                {/* <button onClick={() => handleLike(post.id)}>
                  👍 {post.likes || 0}
                </button>
                <button>💬 {post.comments?.length || 0} Comments</button> */}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CommunityForum;
