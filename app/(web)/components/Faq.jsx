"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "../styles/faq.module.css";

export default function Faq({ faqData = [] }) {
  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  return (
    <section className={`bg-light ${styles.faqSection}`}>
      <div className="container">
        <div className="row gy-5 gy-lg-0 align-items-lg-center">
          <div className="col-12 col-lg-6">
            <Image
              src="/faq.png"
              alt="faq"
              width={600}
              height={400}
              className="img-fluid rounded"
            />
          </div>
          <div className="col-12 col-lg-6">
            <div className="row justify-content-xl-end">
              <div className="col-12 col-xl-11">
                <h2
                  className={`h1 mb-3 ${styles.faqTitle}`}
                  style={{ color: "#192f59" }}
                >
                  How can we help you?
                </h2>
                <p>
                  We hope you have found an answer to your question. If you need
                  any help, please search your query on our Support Center or
                  contact us via email.
                </p>
                <div
                  className="accordion accordion-flush"
                  id="accordionExample"
                >
                  {faqData?.map((faq, index) => (
                    <div className="accordion-item" key={index}>
                      <h2 className="accordion-header" id={`heading${index}`}>
                        <button
                          className={`accordion-button ${
                            activeAccordion === index ? "" : "collapsed"
                          }`}
                          type="button"
                          onClick={() => toggleAccordion(index)}
                        >
                          {faq.question}
                        </button>
                      </h2>
                      <div
                        id={`collapse${index}`}
                        className={`accordion-collapse collapse ${
                          activeAccordion === index ? "show" : ""
                        }`}
                        aria-labelledby={`heading${index}`}
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">{faq.answer}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
