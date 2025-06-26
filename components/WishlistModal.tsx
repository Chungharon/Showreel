'use client'

import { useState } from 'react'

interface WishlistModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function WishlistModal({ isOpen, onClose }: WishlistModalProps) {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Here you would typically send the email to your backend
      // For now, we'll just show a success message
      setIsSubmitted(true)
    }
  }

  const handleClose = () => {
    setEmail('')
    setIsSubmitted(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="wishlist-modal active" onClick={handleClose}>
      <div className="wishlist-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={handleClose}>&times;</button>
        
        {!isSubmitted ? (
          <>
            <h2>Join Wishlist</h2>
            <p>Be the first to know when we launch! Enter your email to get early access and exclusive updates.</p>
            <form className="wishlist-form" onSubmit={handleSubmit}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
              <button type="submit">Join Wishlist</button>
            </form>
          </>
        ) : (
          <>
            <h2>Thank You!</h2>
            <p>You've been added to our wishlist. We'll notify you as soon as we launch!</p>
            <button className="wishlist-form button" onClick={handleClose}>Close</button>
          </>
        )}
      </div>
    </div>
  )
} 