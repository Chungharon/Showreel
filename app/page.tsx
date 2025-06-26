'use client'

import { useEffect, useRef, useState } from 'react'
import WishlistModal from '../components/WishlistModal'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import SplitType from 'split-type'

// Pre-register GSAP plugins
gsap.registerPlugin(Flip)

export default function Home() {
  const heroRef = useRef<HTMLElement>(null)
  const wishlistBtnRef = useRef<HTMLAnchorElement>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [email, setEmail] = useState('')
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false)

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsModalOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    document.body.style.overflow = 'auto'
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Here you would typically send the email to your backend
      console.log('Email submitted:', email)
      setIsEmailSubmitted(true)
      setEmail('')
      
      // Reset after 3 seconds
      setTimeout(() => {
        setIsEmailSubmitted(false)
      }, 3000)
    }
  }

  useEffect(() => {
    let splitTextInstances: any[] = []

    const initializeAnimations = () => {
      const setupTextSplitting = () => {
        splitTextInstances.forEach(instance => instance.revert())
        splitTextInstances = []

        const textElements = document.querySelectorAll("h1, h2, p, a:not(#wishlist-btn)")
        textElements.forEach((element) => {
          const splitInstance = new SplitType(element as HTMLElement, {
            types: "lines",
            lineClass: "line",
          })
          splitTextInstances.push(splitInstance)
        })
      }

      const createCounterDigits = () => {
        const counter1 = document.querySelector(".counter-1")
        const counter2 = document.querySelector(".counter-2")
        const counter3 = document.querySelector(".counter-3")
        
        if (counter1) counter1.innerHTML = '<div class="num">0</div>'
        if (counter2) counter2.innerHTML = '<div class="num">0</div>'
        if (counter3) counter3.innerHTML = '<div class="num">0</div>'
      }

      const animateCounter = (duration: number) => {
        let currentNumber = 0
        const targetNumber = 100
        const counter1 = document.querySelector(".counter-1 .num")
        const counter2 = document.querySelector(".counter-2 .num")
        const counter3 = document.querySelector(".counter-3 .num")
        
        const interval = duration * 1000 / targetNumber
        
        setTimeout(() => {
          const timer = setInterval(() => {
            currentNumber++
            
            if (currentNumber > targetNumber) {
              clearInterval(timer)
              return
            }
            
            const hundreds = Math.floor(currentNumber / 100)
            const tens = Math.floor((currentNumber % 100) / 10)
            const ones = currentNumber % 10
            
            if (counter1) counter1.textContent = hundreds.toString()
            if (counter2) counter2.textContent = tens.toString()
            if (counter3) counter3.textContent = ones.toString()
            
          }, interval)
        }, 500)
      }

      const animateImages = () => {
        const images = document.querySelectorAll(".img")
        images.forEach((img) => img.classList.remove("animate-out"))
        
        const state = Flip.getState(images)
        images.forEach((img) => img.classList.add("animate-out"))

        const mainTimeline = gsap.timeline()
        mainTimeline.add(Flip.from(state, {
          duration: 1,
          stagger: 0.1,
          ease: "power3.inOut",
        }))

        images.forEach((img, index) => {
          const scaleTimeline = gsap.timeline()
          scaleTimeline
            .to(img, { scale: 2.5, duration: 0.45, ease: "power3.in" }, 0.025)
            .to(img, { scale: 1, duration: 0.45, ease: "power3.out" }, 0.5)
          mainTimeline.add(scaleTimeline, index * 0.1)
        })
      }

      // Initialize everything
      setupTextSplitting()
      createCounterDigits()
      animateCounter(1)

      // Main animation timeline
      const t1 = gsap.timeline()

      t1.to(".hero-bg", {
        scaleY: "100%",
        duration: 3,
        ease: "power2.inOut",
        delay: 0.25,
      })

      t1.to(".img", {
        scale: 1,
        duration: 1,
        stagger: 0.125,
        ease: "power3.out",
      }, "<")

      t1.to(".counter", {
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
        delay: 1.5,
        onStart: () => animateImages(),
      })

      t1.to(".sidebar .divider", {
        scaleY: "100%",
        duration: 1,
        ease: "power3.inOut",
        delay: 1.25,
      })

      t1.to(["nav .divider", ".site-info .divider"], {
        scaleX: "100%",
        duration: 1,
        stagger: 0.5,
        ease: "power3.inOut",
      }, "<")

      t1.to(".logo", {
        scale: 1,
        duration: 1,
        ease: "power4.inOut",
      }, "<")

      t1.to([
        ".logo-name a .line",
        ".links a .line",
        ".links p .line",
        ".cta a .line"
      ], {
        y: "0%",
        opacity: 1,
        duration: 0.8,
        stagger: 0.05,
        ease: "power4.Out",
        delay: 0.5,
      }, "<")

      t1.to([
        ".header .line",
        ".site-info .line",
        ".hero-footer .line"
      ], {
        y: "0%",
        opacity: 1,
        duration: 0.8,
        stagger: 0.05,
        ease: "power4.Out",
        delay: 0.5,
      }, "<")

      // Add animation-settled class when animation completes
      t1.call(() => {
        if (wishlistBtnRef.current) {
          wishlistBtnRef.current.classList.add('animation-settled')
        }
      })
    }

    // Wait for images to load before starting animations
    const images = document.querySelectorAll('img')
    let loadedImages = 0
    
    const checkAllImagesLoaded = () => {
      loadedImages++
      if (loadedImages === images.length) {
        setIsLoaded(true)
        initializeAnimations()
      }
    }

    images.forEach(img => {
      if (img.complete) {
        checkAllImagesLoaded()
      } else {
        img.addEventListener('load', checkAllImagesLoaded)
        img.addEventListener('error', checkAllImagesLoaded) // Handle errors too
      }
    })

    // Fallback if no images
    if (images.length === 0) {
      setIsLoaded(true)
      initializeAnimations()
    }

    // Cleanup function
    return () => {
      splitTextInstances.forEach(instance => instance.revert())
      images.forEach(img => {
        img.removeEventListener('load', checkAllImagesLoaded)
        img.removeEventListener('error', checkAllImagesLoaded)
      })
    }
  }, [])

  return (
    <>
      <section className={`hero ${!isLoaded ? 'loading' : ''}`} ref={heroRef}>
        <div className="hero-bg"></div>
        <div className="counter">
          <div className="counter-1 digit"><div className="num">0</div></div>
          <div className="counter-2 digit"><div className="num">0</div></div>
          <div className="counter-3 digit"><div className="num">0</div></div>
        </div>
        <div className="images-container">
          <div className="img"><img src="/image/img01.jpg" alt="Nairobi nightlife event" loading="eager" /></div>
          <div className="img"><img src="/image/img02.jpg" alt="Nairobi nightlife event" loading="eager" /></div>
          <div className="img"><img src="/image/img01.jpg" alt="Nairobi nightlife event" loading="eager" /></div>
          <div className="img"><img src="/image/img02.jpg" alt="Nairobi nightlife event" loading="eager" /></div>
          <div className="img"><img src="/image/img01.jpg" alt="Nairobi nightlife event" loading="eager" /></div>
          <div className="img"><img src="/image/img02.jpg" alt="Nairobi nightlife event" loading="eager" /></div>
          <div className="img"><img src="/image/img01.jpg" alt="Nairobi nightlife event" loading="eager" /></div>
          <div className="img"><img src="/image/img02.jpg" alt="Nairobi nightlife event" loading="eager" /></div>
          <div className="img"><img src="/image/img01.jpg" alt="Nairobi nightlife event" loading="eager" /></div>
          <div className="img"><img src="/image/img02.jpg" alt="Nairobi nightlife event" loading="eager" /></div>
          <div className="img"><img src="/image/img01.jpg" alt="Nairobi nightlife event" loading="eager" /></div>
          <div className="img"><img src="/image/img02.jpg" alt="Nairobi nightlife event" loading="eager" /></div>
          <div className="img"><img src="/image/img01.jpg" alt="Nairobi nightlife event" loading="eager" /></div>
          <div className="img"><img src="/image/img02.jpg" alt="Nairobi nightlife event" loading="eager" /></div>
          <div className="img"><img src="/image/img01.jpg" alt="Nairobi nightlife event" loading="eager" /></div>
        </div>
        <nav>
          <div className="logo-name">
            <a href="#" className="Omno">Omno</a>
          </div>

          <div className="nav-items">
            <div className="links">
              <a href="#" className="Portfolio">Portfolio</a>
              <p>/</p>
              <a href="#">About</a>
            </div>

            <div className="cta">
              <a href="#" id="wishlist-btn" ref={wishlistBtnRef} onClick={handleWishlistClick}>
                Join Wishlist
                <svg className="arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4L12 20M12 20L18 14M12 20L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="divider"></div>
        </nav>

        <div className="sidebar">
          <div className="logo">
            <img src="/image/logo_dark.png" alt="" loading="eager" />
          </div>
          <div className="divider"></div>
        </div>
        
        <div className="header">
          <h1>Visual engineering for modern brands</h1>
        </div>

        <div className="site-info">
          <h2>A design team focused on brands websites, apps and products</h2>
          <div className="divider"></div>
          <div className="site-info-copy">
            <p>Award-winning creative studio</p>
            <p>Operating since 2023</p>
          </div>
        </div>

        <div className="hero-footer">
          <h2>Watch Showreel</h2>
        </div>
      </section>

      <WishlistModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  )
} 