'use client';

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { gsap } from "gsap";

export default function ContactForm({ performanceTier }) {
  const root = useRef(null);
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ mode: "onBlur" });

  useEffect(() => {
    if (!root.current) return;
    const chamber = root.current.querySelector(".chamber");
    const animation = gsap.fromTo(
      chamber,
      { opacity: 0, scale: 0.98, filter: "blur(2px)" },
      { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.6, ease: "power3.out" }
    );

    return () => {
      animation.kill();
    };
  }, [step]);

  const advance = async () => {
    const valid = await trigger(step === 1 ? ["name", "email"] : step === 2 ? ["subject"] : ["message"]);
    if (valid) setStep((s) => Math.min(3, s + 1));
  };

  const onSubmit = async (data) => {
    console.log("Contact form submission:", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    reset();
    setStep(1);
  };

  return (
    <section className="contact-form section-pad" aria-labelledby="contact-form-heading" ref={root}>
      <h2 id="contact-form-heading">Feedback Universe</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="chamber" role="group" aria-label={`Vault chamber step ${step}`}>
          {step === 1 && (
            <>
              <div className="input-wrap">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  {...register("name", { required: "Name is required" })}
                  aria-invalid={errors.name ? "true" : "false"}
                />
                {errors.name && <span role="alert" className="error-msg">{errors.name.message}</span>}
              </div>

              <div className="input-wrap">
                <label htmlFor="cf-email">Email</label>
                <input
                  id="cf-email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Enter a valid email" },
                  })}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && <span role="alert" className="error-msg">{errors.email.message}</span>}
              </div>
            </>
          )}

          {step === 2 && (
            <div className="input-wrap">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                {...register("subject", { required: "Subject is required" })}
                aria-invalid={errors.subject ? "true" : "false"}
              />
              {errors.subject && <span role="alert" className="error-msg">{errors.subject.message}</span>}
            </div>
          )}

          {step === 3 && (
            <div className="input-wrap">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                rows={6}
                {...register("message", { 
                  required: "Message is required", 
                  minLength: { value: 10, message: "At least 10 characters" } 
                })}
                aria-invalid={errors.message ? "true" : "false"}
              />
              {errors.message && <span role="alert" className="error-msg">{errors.message.message}</span>}
            </div>
          )}
        </div>

        <div className="vault-controls">
          {step < 3 ? (
            <button 
              type="button" 
              className="btn-neon" 
              onClick={advance} 
              aria-label="Next chamber"
            >
              Unlock Next
            </button>
          ) : (
            <button 
              type="submit" 
              className="btn-neon" 
              aria-label="Submit message"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Transmit"}
            </button>
          )}
        </div>
      </form>
    </section>
  );
}





