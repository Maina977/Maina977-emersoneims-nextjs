'use client';

import React, { useEffect, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { gsap } from "gsap";

export default function EmailUs({ performanceTier }) {
  const root = useRef(null);
  const glow = useMemo(() => 
    performanceTier === "low" ? 0.3 : performanceTier === "medium" ? 0.6 : 1,
    [performanceTier]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm();

  useEffect(() => {
    if (!root.current) return;
    const icons = root.current.querySelectorAll(".email-icon");
    const animation = gsap.to(icons, {
      rotate: 360,
      transformOrigin: "center",
      repeat: -1,
      duration: 16,
      ease: "none",
      stagger: 0.2,
    });

    return () => {
      animation.kill();
    };
  }, []);

  const onSubmit = (data) => {
    console.log("Email request:", data);
    reset();
  };

  return (
    <section className="email-us section-pad" aria-labelledby="email-us-heading" ref={root}>
      <h2 id="email-us-heading">Email Us</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate aria-describedby="email-help">
        <div className="input-wrap">
          <label htmlFor="email-input">Your Email</label>
          <input
            id="email-input"
            type="email"
            placeholder="name@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Enter a valid email" },
            })}
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : "email-help"}
          />
          {errors.email && (
            <span id="email-error" role="alert" className="error-msg">
              {errors.email.message}
            </span>
          )}
          <p id="email-help" className="assistive-text">
            We respond fast. Your email stays private.
          </p>
        </div>
        <button type="submit" className="btn-neon" aria-label="Send email">
          Send
        </button>
        {isSubmitSuccessful && (
          <p role="status" className="success-msg">
            Sent! Check your inbox for confirmation.
          </p>
        )}
      </form>

      <div className="email-list" role="list" aria-label="Direct email addresses">
        <div className="email-item" role="listitem">
          <span 
            className="email-icon" 
            style={{ filter: `drop-shadow(0 0 10px rgba(0,255,255,${glow}))` }} 
          />
          <a href="mailto:info@emersoneims.com">info@emersoneims.com</a>
        </div>
        <div className="email-item" role="listitem">
          <span 
            className="email-icon" 
            style={{ filter: `drop-shadow(0 0 10px rgba(0,255,255,${glow}))` }} 
          />
          <a href="mailto:emersoneimservices@gmail.com">emersoneimservices@gmail.com</a>
        </div>
      </div>
    </section>
  );
}

