"use client";
import React from 'react'
import axios from 'axios';
import { FaEnvelope } from 'react-icons/fa';



function page() {
  return (
    <div className="container-fluid" style={{ paddingTop: "20px" }}>
    <div className="row">
      <div className="col-lg-4 col-6">
        <div className="small-box bg-info">
          <div className="inner">
            <h3>150</h3>
            <p>Avaliable Massege</p>
          </div>
          <div className="icon">
            <i className="ion ion-bag"></i>
          </div>
          <a href="#" className="small-box-footer">
            More info <i className="fas fa-arrow-circle-right"></i>
          </a>
        </div>
      </div>

      <div className="col-lg-4 col-6">
        <div className="small-box bg-success">
          <div className="inner">
            <h3>53</h3>
            <p>This Week</p>
          </div>
          <div className="icon">
            <i className="ion ion-stats-bars"></i>
          </div>
          <a href="#" className="small-box-footer">
            More info <i className="fas fa-arrow-circle-right"></i>
          </a>
        </div>
      </div>

      <div className="col-lg-4 col-6">
        <div className="small-box bg-warning">
          <div className="inner">
            <h3>44</h3>
            <p>This Month</p>
          </div>
          <div className="icon">
            <i className="ion ion-person-add"></i>
          </div>
          <a href="#" className="small-box-footer">
            More info <i className="fas fa-arrow-circle-right"></i>
          </a>
        </div>
      </div>

      {/* <div className="col-lg-3 col-6">
        <div className="small-box bg-danger">
          <div className="inner">
            <h3>65</h3>
            <p>This Year</p>
          </div>
          <div className="icon">
            <i className="ion ion-pie-graph"></i>
          </div>
          <a href="#" className="small-box-footer">
            More info <i className="fas fa-arrow-circle-right"></i>
          </a>
        </div>
      </div> */}
{/* 
      <div className="col-lg-4 col-6">
        <div className="info-box">
          <span className="info-box-icon bg-info">
            <FaEnvelope />
          </span>
          <div className="info-box-content">
            <span className="info-box-text">Avaliable Messages</span>
            <span className="info-box-number">1,410</span>
          </div>
        </div>
      </div>
      <div className="col-lg-4 col-6">
        <div className="info-box">
          <span className="info-box-icon bg-info">
            <FaEnvelope />
          </span>
          <div className="info-box-content">
            <span className="info-box-text">Weekly Messages</span>
            <span className="info-box-number">1,410</span>
          </div>
        </div>
      </div>
      <div className="col-lg-4 col-6">
        <div className="info-box">
          <span className="info-box-icon bg-info">
            <FaEnvelope />
          </span>
          <div className="info-box-content">
            <span className="info-box-text">Monthly Messages</span>
            <span className="info-box-number">1,410</span>
          </div>
        </div>
      </div> */}
    </div>
    </div>
  )
}

export default page
