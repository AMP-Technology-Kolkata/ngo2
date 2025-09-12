"use client";
import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import Link from "next/link";

const Page = () => {
  const [recipientList, setRecipientList] = useState([]);
  const [sendToMobile, setSendToMobile] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [selectedCategorys, setSelectedCategorys] = useState([]);
  const [mobileNumbers, setMobileNumbers] = useState([]); // Added this line

  const handleCheckboxChange = () => {
    setSendToMobile(!sendToMobile);
  };

  const handleMessageChange = (event) => {
    setSelectedMessage(event.target.value);
  };

  const handleRecipientChange = (event) => {
    setSelectedRecipients(
      Array.from(event.target.selectedOptions, (option) => option.value)
    );
  };
  const handleCategoryChange = (event) => {
    setSelectedCategorys(
      Array.from(event.target.selectedOptions, (option) => option.value)
    );
  };
  const handleMobileNumberChange = (event) => {
    setMobileNumbers(
      event.target.value.split(",").map((number) => number.trim())
    );
  };

  const handleSend = () => {
    // Handle send logic here
    console.log("Sending to:", selectedRecipients);
    console.log("Sending to:", selectedCategorys);
    console.log("Send to Mobile:", sendToMobile);
    console.log("Selected Message:", selectedMessage);
    console.log("Mobile Numbers:", mobileNumbers);
    // Add logic to send data
  };

  return (
    <div className="container-fluid" style={{ paddingTop: "20px" }}>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        {/* <button
          className="btn btn-primary me-md-2"
          type="button"
          style={{ margin: "5px" }}
        >
          Button
        </button>
        <Link href="/">
          <button
            className="btn btn-primary"
            role="button"
            style={{ margin: "5px" }}
          >
            Button
          </button>
        </Link> */}
        <div className="col-lg-4 col-6">
          <div className="info-box">
            <span className="info-box-icon bg-info">
              <FaEnvelope />
            </span>
            <div className="info-box-content">
              <span className="info-box-text">Avaliable Messages</span>
              <span className="info-box-number">410</span>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: "500px",
          margin: "auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      >
        <form>
          <div style={{ marginTop: "20px" }}>
            <label>Message:</label>
            <select
              value={selectedMessage}
              onChange={handleMessageChange}
              style={{
                marginLeft: "5px",
                padding: "5px",
                borderRadius: "3px",
                border: "1px solid #ccc",
                width: "100%",
              }}
            >
              <option value="">Select a message</option>
              <option value="Message 1">Message 1</option>
              <option value="Message 2">Message 2</option>
            </select>
          </div>

          <div  style={{ marginTop: "20px" }}>
            <label>Select Category:</label>
            <select
              value={selectedRecipients}
              onChange={handleCategoryChange}
              style={{
                marginLeft: "5px",
                padding: "5px",
                borderRadius: "3px",
                border: "1px solid #ccc",
                width: "100%",
              }}
            >
              <option value="">Select a Category</option>
              <option value="Category1">Category 1</option>
              <option value="Category2">Category 2</option>
              {/* Add more options as needed */}
            </select>
          </div>
          <div style={{ marginTop: "20px" }}>
            <label>Select Recipients:</label>
            <select
              value={selectedRecipients}
              onChange={handleRecipientChange}
              style={{
                marginLeft: "5px",
                padding: "5px",
                borderRadius: "3px",
                border: "1px solid #ccc",
                width: "100%",
              }}
            >
              <option value="">Select a Recipient</option>
              <option value="recipient1">Recipient 1</option>
              <option value="recipient2">Recipient 2</option>
              {/* Add more options as needed */}
            </select>
          </div>

          {sendToMobile && (
            <div style={{ marginTop: "20px" }}>
              <label>Mobile Numbers:</label>
              <select
                value={mobileNumbers}
                onChange={handleMobileNumberChange}
                style={{
                  marginLeft: "5px",
                  padding: "5px",
                  borderRadius: "3px",
                  border: "1px solid #ccc",
                  width: "100%",
                }}
              >
                {/* Dynamically render mobile number options */}
                {mobileNumbers.map((number, index) => (
                  <option key={index} value={number}>
                    {number}
                  </option>
                ))}
              </select>
            </div>
          )}
          <button
            type="button"
            onClick={handleSend}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
