import React, { useEffect, useState } from 'react';
import './Subscription.css';
import axios from 'axios';
import useLoggedInUser from "../../../hooks/useLoggedInUser"



const Subscription = () => {

  const [loggedInUser, setLoggedInUser] = useLoggedInUser();
  const username = loggedInUser?.username ? loggedInUser?.username : loggedInUser?.email;
  const email = loggedInUser?.email;
  const FullName = loggedInUser?.fullName;

  const [isMonthlyPlanBtnPressed, setMonthlyPlanBtn] = useState(true);

  const [monthlyPlan, setMonthlyPlan] = useState([]);
  const [yearlyPlan, setYearlyPlan] = useState([]);

  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const loadRazorpayScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initializeRazorpay = async () => {
    const isRazorpayLoaded = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
    setRazorpayLoaded(isRazorpayLoaded);
  };
    


  const handleSubscription = (plan) => {
    if (!razorpayLoaded) {
      alert("Razorpay SDK not loaded");
      return;
    }

    const options = {
      key: process.env.REACT_APP_RAZOR_PAY_KEY,
      amount: plan.price * 100,
      currency: "INR",
      name: username || FullName,
      description: `Subscription for ${plan.name}`,
      handler: function (response) {

        axios.get(`http://localhost:5000/subscriptions/user/${email}`)
        .then((response) => {
          if (response.data.length === 1) {
            const prevPostLimit = response.data[0].postLimit;

            console.log("inside 1st axios.get");

            axios.patch(`http://localhost:5000/subscriptions/user/${email}`, {
              postLimit: prevPostLimit + plan.postLimit
            })
            .then((response) => {
              console.log("inside 2nd axios.patch");
              alert('Subscription added successfully');
            })
            .catch((error) => {
              console.error('Error in patch request:', error);
              alert('Error adding subscription1');
            });
          }
          else {
            console.error('Subscription not found or multiple subscriptions returned');
            alert('Subscription not found');
          }
      })
      .catch((error) => {
        console.error('Error in get request:', error);
        alert('Error adding subscription2');
      });

          
        
      },
      prefill: {
        name: username,
        email: email
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.on('payment.failed', function (response) {
      alert(response.error.code);
      alert(response.error.description);
    });
    rzp1.open();
  };

  const handleMonthlyBtn = () => {
    const MonthlyBtn = document.querySelector('.PlanningOptionsBtn .MonthlyBtn');
    const YearlyBtn = document.querySelector('.PlanningOptionsBtn .YearlyBtn');
  
    MonthlyBtn.style.backgroundColor = '#f3c58c';
    MonthlyBtn.style.color = '#ffffff';
    MonthlyBtn.style.borderRadius = "10px";
  
    YearlyBtn.style.backgroundColor = '#fff';
    YearlyBtn.style.color = '#000';

    setMonthlyPlanBtn(true);
  
    getMonthlyPlan();
  
  }
  
  const handleYearlyBtn = () => {
    const MonthlyBtn = document.querySelector('.PlanningOptionsBtn .MonthlyBtn');
    const YearlyBtn = document.querySelector('.PlanningOptionsBtn .YearlyBtn');
    
    YearlyBtn.style.backgroundColor = '#f3c58c';
    YearlyBtn.style.color = '#ffffff'; 
    YearlyBtn.style.borderRadius = "10px";
  
    MonthlyBtn.style.backgroundColor = '#fff';
    MonthlyBtn.style.color = '#000';

    setMonthlyPlanBtn(false);
  
    getYearlyPlan();
  }

  const getMonthlyPlan = () => {
    axios.get('http://localhost:5000/subscriptions/monthly').then((response) => {
      setMonthlyPlan(response.data);
    });
  }
  
  const getYearlyPlan = () => {
    axios.get('http://localhost:5000/subscriptions/yearly').then((response) => {
      setYearlyPlan(response.data);
    });
  }

  useEffect(() => {
    handleMonthlyBtn();
    getMonthlyPlan();
    getYearlyPlan();

    initializeRazorpay();
  }, []);

  return (
    <div className='SubscriptionPage'>
      
      <div className="Intro">
        <div className='Intro-Text'>
          <h1>Plans &  Pricing</h1>
          <p>Choose the plan that works for you</p>
        </div>

        <div className='PlanningOptionsBtn'>
          <button className='MonthlyBtn' onClick={handleMonthlyBtn}>Monthly</button>
          <button className='YearlyBtn' onClick={handleYearlyBtn} >Yearly</button>
        </div>
      </div>

      <div className="SubscriptionPlans">
        {isMonthlyPlanBtnPressed ? (
          monthlyPlan.length === 0 ? (
            <div className="NoPlans">No Monthly plans to show currently</div>
          ) : (
            <div className="MonthlyPlan">
              {monthlyPlan.map((plan) => (
                <div className="Plan" key={plan.planName}>
                  <h2>{plan.name}</h2>
                  <h3>{plan.price}</h3>
                  <p>{plan.description}</p>
                  <ul className="FeaturesList">
                    {plan.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <button onClick={() => handleSubscription(plan)}>Subscribe</button>
                </div>
              ))}
            </div>
          )
        ) : (
          yearlyPlan.length === 0 ? (
            <div className="NoPlans">No Yearly plans to show currently</div>
          ) : (
            <div className="YearlyPlan">
              {yearlyPlan.map((plan) => (
                <div className="Plan" key={plan.planName}>
                  <h2>{plan.name}</h2>
                  <h3>{plan.price}</h3>
                  <p>{plan.description}</p>
                  <ul className="FeaturesList">
                    {plan.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <button onClick={() => handleSubscription(plan)}>Subscribe</button>
                </div>
              ))}
            </div>
          )
        )}
      </div>  
      

    </div>
  );
};

export default Subscription;
