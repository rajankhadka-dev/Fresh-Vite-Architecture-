import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BLOG_POSTS } from '../data/blogPosts'
import Header from '../components/Header'
import Footer from '../components/Footer'

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [selectedPost])

  return (
    <div className="blog-page">
      <Header />
      
      <main className="blog-main">
        <header className="blog-header">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-title"
          >
            Technical Insights
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="blog-intro"
          >
            Exploring the intersection of AI, Finance, and Modern Engineering.
          </motion.p>
        </header>

        {selectedPost ? (
          <motion.article 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="blog-full-post"
          >
            <button className="back-btn" onClick={() => setSelectedPost(null)}>
              ← Back to all posts
            </button>
            <div className="post-meta">
              <span className="post-category">{selectedPost.category}</span>
              <span className="post-date">{selectedPost.date} • {selectedPost.readTime}</span>
            </div>
            <h2 className="post-title-full">{selectedPost.title}</h2>
            <div className="post-content">
              {selectedPost.content.split('\n').map((para, i) => (
                para.trim() && (
                  para.startsWith('###') ? 
                    <h3 key={i}>{para.replace('###', '')}</h3> :
                    para.startsWith('*') ? 
                      <li key={i}>{para.replace('*', '')}</li> :
                      <p key={i}>{para}</p>
                )
              ))}
            </div>
          </motion.article>
        ) : (
          <div className="blog-grid">
            {BLOG_POSTS.map((post, index) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="blog-card"
                onClick={() => setSelectedPost(post)}
              >
                <div className="post-meta">
                  <span className="post-category">{post.category}</span>
                  <span className="post-date">{post.date}</span>
                </div>
                <h3 className="post-title">{post.title}</h3>
                <p className="post-excerpt">{post.excerpt}</p>
                <span className="read-more">Read Article →</span>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Blog
