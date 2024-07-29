// src/Pages/Explore/Explore.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Explore.css';

import defaultImage from '../../assets/images/news_placeholder.png';

const Explore = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
        try {
          const response = await axios.get('https://newsapi.org/v2/top-headlines', {
            params: {
              country: 'us',
              apiKey: `${process.env.REACT_APP_NEWS_API}`,
              pageSize: 15,
            },
          });
          console.log('API Response:', response.data); 
          setArticles(response.data.articles);
        } catch (error) {
          console.error('Error fetching news articles:', error);
        }
    };

    fetchArticles();
  }, []);

  return (
    <div className="explore">
      <div className='titleBar'>Explore News</div>
      <div className="articles">
        {articles.map((article, index) => (
          <div key={index} className="article">
            <h2>{article.title}</h2>
            <img
              src={article.urlToImage || defaultImage }
              alt={article.title}
            />
            <p>{article.description}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              Read more
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
