'use client'

import { useState } from 'react'

interface WishlistModalProps {
  isOpen: boolean
  onClose: () => void
  // Optional: Add a prop for a custom submission handler if you want more flexibility
  onSubmitSuccess?: () => void;
}

export default function WishlistModal({ isOpen, onClose, onSubmitSuccess }: WishlistModalProps) {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // New state for loading indicator
  const [error, setError] = useState<string | null>(null) // New state for error messages

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null) // Clear any previous errors

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setIsLoading(true) // Start loading
    try {
      // --- IMPORTANT: This is where you connect to your backend ---
      // Replace this with your actual API endpoint for newsletter sign-ups
      const response = await fetch('/api/subscribe-newsletter', { // Example API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        // If the server response is not OK (e.g., 400, 500)
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong. Please try again.');
      }

      // If submission is successful
      setIsSubmitted(true)
      if (onSubmitSuccess) {
        onSubmitSuccess(); // Call an optional success callback
      }
    } catch (err: any) {
      console.error('Newsletter subscription error:', err)
      setError(err.message || 'Failed to subscribe. Please try again later.')
      setIsSubmitted(false); // Ensure success message isn't shown on error
    } finally {
      setIsLoading(false) // Stop loading
    }
  }

  const handleClose = () => {
    setEmail('')
    setIsSubmitted(false)
    setError(null) // Clear error on close
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="wishlist-modal active" onClick={handleClose}>
      <div className="wishlist-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={handleClose}>&times;</button>
        
        {!isSubmitted ? (
          <>
            <h2>Join Our Newsletter</h2> {/* Updated title */}
            <p>Stay updated with our latest news, exclusive offers, and product launches!</p>
            <form className="wishlist-form" onSubmit={handleSubmit}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                disabled={isLoading} // Disable input while loading
              />
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Subscribing...' : 'Subscribe'} {/* Dynamic button text */}
              </button>
              {error && <p className="error-message" style={{ color: 'red', marginTop: '10px' }}>{error}</p>} {/* Display error message */}
            </form>
          </>
        ) : (
          <>
            <h2>Thank You for Subscribing!</h2> {/* Updated success title */}
            <p>You've been added to our newsletter. Get ready for exciting updates!</p>
            <button
              onClick={handleClose}
              className="newsletter-close-btn"
              >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  )
}