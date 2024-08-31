import React, { useState, useEffect } from 'react';
import { Card, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const GradientCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  color: 'white',
  padding: theme.spacing(4),
  textAlign: 'center',
  boxShadow: theme.shadows ? theme.shadows[3] : '0px 3px 6px rgba(0, 0, 0, 0.1)',
}));

function CardOrderCount() {
  const [orderCount, setOrderCount] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/v1/orders/get/count');
        const data = await response.json();
        setOrderCount(data);
      } catch (e) {
        console.error(e.message);
      }
    };
    fetchData();
  }, []);

  return (
    <GradientCard>
      <Link style={{color:'#fff'}} to={`/order/list`}><Typography variant="h4" style={{color:'#fff'}}> Order Count <ArrowForwardIcon color="white"/></Typography></Link>
      <Typography variant="h4" style={{color:'#fff'}}>
        <ShoppingCartIcon style={{ fontSize: 35, backgroundColor: 'grey', borderRadius: '50%', padding: '8px', color:'#fff', marginRight: '10px' }} /> 
                  {orderCount ? orderCount.orderCount : 'Loading...'}
      </Typography>
    </GradientCard>
  );
}

export default CardOrderCount;
