  import React, { useEffect, useState } from 'react';
  import './Subscription.css';
  import axios from 'axios';
  import useLoggedInUser from "../../../hooks/useLoggedInUser"
  import { useAuthState } from 'react-firebase-hooks/auth';
  import auth  from '../../../firebase.init';

  import { useTranslation } from 'react-i18next';
  import i18next, { use } from 'i18next';



  const Subscription = () => {

    const {t} = useTranslation();

    const [loggedInUser] = useLoggedInUser();
    const user = useAuthState(auth);
    const email = user[0]?.email;
    const displayName = user[0]?.displayName;
    const [paid, setPaid] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    let username = loggedInUser?.username ? loggedInUser?.username : loggedInUser?.email;
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

          axios.get(`${process.env.REACT_APP_Backend_url}/subscriptions/user/${email}`)
          .then((response) => {
            if (response.data.length === 1) {
              const prevPostLimit = response.data[0].postLimit;

              // console.log("inside 1st axios.get");

              axios.patch(`${process.env.REACT_APP_Backend_url}/subscriptions/user/${email}`, {
                postLimit: prevPostLimit + plan.postLimit
              })
              .then((response) => {
                // console.log("inside 2nd axios.patch");
                alert('Subscription added successfully');
                setPaid(true);
                setNotificationMessage(`Your subscription for ${plan.name} has been activated successfully, now your post limit is ${prevPostLimit + plan.postLimit}`);
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


    const sendNotification = (username, email, planName) => {
      if (!username || !email || !planName) {
          console.error('Username, email, and plan name are required');
          return;
        }

      const notification = {
          username: username,
          email: email,
          message : notificationMessage
      };

      console.log('Sending notification:', notification);

      axios.post(`http://localhost:5000/notification`, notification)
      .then((response) => {
          console.log('Notification sent successfully:', response.data);
      })
      .catch((error) => {
          console.error('Error sending notification:', error);
      });
      
  };

    const checkInvoiceStatus = async (inVoiceId, email, plan, intervalId) => {
      try{

        console.log("from frontEnd checkInVoiceStatus ==> ",inVoiceId);

        const response = await axios.get(`${process.env.REACT_APP_Backend_url}/checkInVoiceStatus`,{ params: { inVoiceId } });

        console.log("response.data.status ==> ",response.data.status);

        if(response.data.status === 'paid' ){

        console.log("setting paid to true");

          axios.get(`${process.env.REACT_APP_Backend_url}/subscriptions/user/${email}`)
          .then((response) => {
            if (response.data.length === 1) {
              const prevPostLimit = response.data[0].postLimit;

              // console.log("inside 1st axios.get");

              axios.patch(`${process.env.REACT_APP_Backend_url}/subscriptions/user/${email}`, {
                postLimit: prevPostLimit + plan.postLimit
              })
              .then((response) => {
                // console.log("inside 2nd axios.patch");
                alert('Subscription added successfully');

                setPaid(true);
                setNotificationMessage(`Your subscription for ${plan.name} has been activated successfully, now your post limit is ${prevPostLimit + plan.postLimit}`);

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

    useEffect(() => {
      if (paid === true){
        sendNotification(username, email, notificationMessage);
        setPaid(false);
        setNotificationMessage('');
      }
    }, [paid]);

  


    const POLLING_INTERVAL = 0.1 * 60 * 1000;

    function startPolling(invoiceId, email, plan) {
      const intervalId = setInterval(() => {
        checkInvoiceStatus(invoiceId, email, plan, intervalId);
      }, POLLING_INTERVAL);
    }


    const handleInVoice = (plan) => {

      const NAME = username || displayName;
      const EMAIL = emailFromHook || email;

      axios.post(`${process.env.REACT_APP_Backend_url}/create_invoice`, { plan, NAME, EMAIL })
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
      axios.get(`${process.env.REACT_APP_Backend_url}/subscriptions/monthly`).then((response) => {
        setMonthlyPlan(response.data);
      });
    }
    
    const getYearlyPlan = () => {
      axios.get(`${process.env.REACT_APP_Backend_url}/subscriptions/yearly`).then((response) => {
        setYearlyPlan(response.data);
      });
    }

    useEffect(() => {
      handleMonthlyBtn();
      getMonthlyPlan();
      getYearlyPlan();

      initializeRazorpay();
    }, []);


    useEffect(() => {
      username = loggedInUser?.username ? loggedInUser?.username : loggedInUser?.email;
    }, [loggedInUser]);

    // useEffect(() => {
    //   const fetchAndTranslatePlans = async () => {
    //     const translatePlan = async (plan) => {
    //       const text = `Name: ${plan.name}\nDescription: ${plan.description}\nFeatures: ${plan.features.join(', ')}`;
    //       try {
    //         const response = await axios.post(`${process.env.REACT_APP_Backend_url}/translate`, { text, targetLanguage: i18next.language });
    //         const translatedText = response.data.translatedText.split('\n');
    //         return {
    //           ...plan,
    //           name: translatedText[0].split(': ')[1],
    //           description: translatedText[1].split(': ')[1],
    //           features: translatedText[2].split(': ')[1].split(', '),
    //         };
    //       } catch (error) {
    //         console.error('Error translating text:', error);
    //         return plan;
    //       }
    //     };
  
    //     const translatedMonthlyPlans = await Promise.all(monthlyPlan.map(translatePlan));
    //     setMonthlyPlan(translatedMonthlyPlans);
  
    //     const translatedYearlyPlans = await Promise.all(yearlyPlan.map(translatePlan));
    //     setYearlyPlan(translatedYearlyPlans);
    //   };
  
    //   fetchAndTranslatePlans();
    // }, [i18next.language, monthlyPlan, yearlyPlan]);

    const translateText = async (plan, targetLanguage) => {
      const text = `
        Name: ${plan.name}
        Description: ${plan.description}
        Features: ${plan.features.join(', ')}`;
  
      try {
        const response = await axios.post(`${process.env.REACT_APP_Backend_url}/translate`, {
          text,
          targetLanguage
        });
  
        const translatedText = response.data.translatedText;
        const [nameLine, descriptionLine, featuresLine] = translatedText.split('\n');
  
        const name = nameLine.split(': ')[1];
        const description = descriptionLine.split(': ')[1];
        const features = featuresLine.split(': ')[1].split(', ');
  
        return {
          ...plan,
          name,
          description,
          features
        };
      } catch (error) {
        console.log('Error translating text:', error);
        return plan;
      }
    };

    

    return (
      <div className='SubscriptionPage'>
        
        <div className="Intro">
          <div className='Intro-Text'>
            <h1> {t("Subscriptions_heading")} </h1>
            {/* Plans &  Pricing */}
            <p>{t("Subscriptions_tagline")}</p>
            {/* Choose the plan that works for you */}
          </div>

          <div className='PlanningOptionsBtn'>
            <button className='MonthlyBtn' onClick={handleMonthlyBtn}> {t("Subscriptions_monthly")} </button>
            <button className='YearlyBtn' onClick={handleYearlyBtn} > {t("Subscriptions_yearly")} </button>
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
                    <button onClick={() => handleInVoice(plan)} className='InVoiceBtn'> {t("Email_Invoice")} </button>
                    <button onClick={() => handleSubscription(plan)} className='RazorPayBtn' > {t("Pay_Via_RazorPay")} </button>
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
