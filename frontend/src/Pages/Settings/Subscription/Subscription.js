  import React, { useEffect, useState } from 'react';
  import './Subscription.css';
  import axios from 'axios';
  import useLoggedInUser from "../../../hooks/useLoggedInUser"
  import { useAuthState } from 'react-firebase-hooks/auth';
  import auth  from '../../../firebase.init';



  const Subscription = () => {

    const [loggedInUser] = useLoggedInUser();
    const user = useAuthState(auth);
    const email = user[0]?.email;
    const displayName = user[0]?.displayName;

    const username = loggedInUser?.username ? loggedInUser?.username : loggedInUser?.email;
    const emailFromHook = loggedInUser?.email;
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

              // console.log("inside 1st axios.get");

              axios.patch(`http://localhost:5000/subscriptions/user/${email}`, {
                postLimit: prevPostLimit + plan.postLimit
              })
              .then((response) => {
                // console.log("inside 2nd axios.patch");
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

    const checkInvoiceStatus = async (inVoiceId, email, plan, intervalId) => {
      try{

        // console.log("from frontEnd checkInVoiceStatus ==> ",inVoiceId);

        const response = await axios.get('http://localhost:5000/checkInVoiceStatus',{ params: { inVoiceId } });
        if(response.data.status === 'paid' ){
    
          axios.get(`http://localhost:5000/subscriptions/user/${email}`)
          .then((response) => {
            if (response.data.length === 1) {
              const prevPostLimit = response.data[0].postLimit;

              // console.log("inside 1st axios.get");

              axios.patch(`http://localhost:5000/subscriptions/user/${email}`, {
                postLimit: prevPostLimit + plan.postLimit
              })
              .then((response) => {
                // console.log("inside 2nd axios.patch");
                alert('Subscription added successfully');
                clearInterval(intervalId);
              })
              .catch((error) => {
                console.error('Error in patch request:', error);
                alert('Error adding subscription1');
                clearInterval(intervalId);
              });
            }
            else {
              console.error('Subscription not found or multiple subscriptions returned');
              alert('Subscription not found');
              clearInterval(intervalId);
            }
          });
    
        }
    
      }catch(error){
        console.log('Error checking invoice status:', error);
        clearInterval(intervalId);
      }
      
    }
  


    const POLLING_INTERVAL = 0.1 * 60 * 1000;

    function startPolling(invoiceId, email, plan) {
      const intervalId = setInterval(() => {
        checkInvoiceStatus(invoiceId, email, plan, intervalId);
      }, POLLING_INTERVAL);
    }


    const handleInVoice = (plan) => {

      const NAME = username || displayName;
      const EMAIL = emailFromHook || email;

      axios.post('http://localhost:5000/create_invoice', { plan, NAME, EMAIL })
        .then(response => {
          console.log('Invoice created successfully:', response.data);

          // console.log("id ====> ",response.data.id);

          alert("Please check your email for the invoice. Your subscription will be activated within 5 minutes of successful payment.");

          startPolling(response.data.id, EMAIL, plan);

        })
        .catch(error => {
          console.error('Error creating invoice:', error);
        });
    }

    


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
                    <button onClick={() => handleInVoice(plan)} className='InVoiceBtn'>Email Invoice</button>
                    <button onClick={() => handleSubscription(plan)} className='RazorPayBtn' >Pay via RazorPay</button>
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
                    <button onClick={() => handleInVoice(plan)} className='InVoiceBtn' >Email Invoice</button>
                    <button onClick={() => handleSubscription(plan)} className='RazorPayBtn' >Pay via RazorPay</button>
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
