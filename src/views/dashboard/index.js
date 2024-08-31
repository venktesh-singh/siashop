import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Form } from 'react-bootstrap';  
import moment from 'moment';
import avatar1 from '../../assets/images/user/avatar-1.jpg';
import CardOrderCount from './Cards/CardOrderCount';
import CardProduct from './Cards/CardProduct';
import CardSale from './Cards/CardSale';
import CardTotalUser from './Cards/CardTotalUser';

const DashDefault = () => {
  const [allUser, setAllUser] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/v1/users/');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setAllUser(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchUserData();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
        const response = await fetch(`http://localhost:4000/api/v1/users/status/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });
        if (!response.ok) {
            throw new Error('Failed to update user status');
        }

        const updatedUser = await response.json();
        setUsers(users.map(user => user._id === id ? updatedUser : user));
        toast.success('User status updated successfully!', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    } catch (error) {
        setError(error.message);
    }
}

const fetchData = async () => {
  try {
      const response = await fetch('http://localhost:4000/api/v1/orders/');
      if (!response.ok) {
          throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
  } catch (err) {
      setError(err.message);
  }
};

useEffect(() => {
  fetchData();
}, []);

useEffect(() => {
  if (orders.length > 0 && orders[0].user) {
      console.log("First Order User:", orders[0].user.username);
  }
}, [orders]);

const orderUpdate = async (id, newStatus) => {
  try {
      const response = await fetch(`http://localhost:4000/api/v1/orders/status/update/${id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
          throw new Error('Failed to update order status');
      }

      const updatedOrder = await response.json();
      setOrders(orders.map(order => order._id === id ? updatedOrder : order));

      toast.success("Order status updated successfully!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
      });
  } catch (error) {
      setError(error.message);
  }
};
  
  return (
    <> 
      <style type="text/css">
        {`
          .mb-row {
              margin-bottom: 2rem; 
          }
        `}
      </style>
      <div className="dashboard section">
        <Row>
          <Col lg={12}>
            <Row className="mb-row">
              <Col lg={3}>
                <CardOrderCount />
              </Col>
              <Col lg={3}>
                <CardProduct />
              </Col>
              <Col lg={3}>
                <CardSale />
              </Col>
              <Col lg={3}>
                <CardTotalUser />
              </Col>
            </Row>
          </Col>
          <Col lg={8}>
            <Card className="Recent-Users">
              <Card.Header>
                <Card.Title as="h5">Recent Users</Card.Title>
              </Card.Header>
              <Card.Body className="px-0 py-2">
                <Table responsive hover className="recent-users">
                  <tbody>
                    {allUser.map((user, index) => (
                      <tr className="unread" key={index}>
                        <td>
                          <img className="rounded-circle" style={{ width: '40px' }} src={avatar1} alt="activity-user" />
                        </td>
                        <td>
                          <h6 className="mb-1">{user.username}</h6>
                          <p className="m-0">{user.email}</p>
                        </td>
                        <td>{user.phone}</td> 
                        <td>{user.city}</td>
                        <td>
                          <h6 className="text-muted">
                            <i className="fa fa-circle text-c-green f-10 m-r-15" />
                            {moment(user.dateCreated).format('Do MMMM YYYY')}
                          </h6>
                        </td>
                        <td>
                            <Form.Select
                                value={user.status}
                                onChange={(e) => updateStatus(user._id, e.target.value)}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Approve">Approve</option>
                                <option value="Reject">Reject</option>
                            </Form.Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="card-event">
              <Card.Body>
                <div className="row align-items-center justify-content-center">
                  <div className="col">
                    <h5 className="m-0">Upcoming Event</h5>
                  </div>
                  <div className="col-auto">
                    <label className="label theme-bg2 text-white f-14 f-w-400 float-end">34%</label>
                  </div>
                </div>
                <h2 className="mt-2 f-w-300">
                  45<sub className="text-muted f-14">Competitors</sub>
                </h2>
                <h6 className="text-muted mt-3 mb-0">You can participate in event </h6>
                <i className="fa fa-angellist text-c-purple f-50" />
              </Card.Body>
            </Card>
            <Card>
              <Card.Body className="border-bottom">
                <div className="row d-flex align-items-center">
                  <div className="col-auto">
                    <i className="feather icon-zap f-30 text-c-green" />
                  </div>
                  <div className="col">
                    <h3 className="f-w-300">235</h3>
                    <span className="d-block text-uppercase">total ideas</span>
                  </div>
                </div>
              </Card.Body>
              <Card.Body>
                <div className="row d-flex align-items-center">
                  <div className="col-auto">
                    <i className="feather icon-map-pin f-30 text-c-blue" />
                  </div>
                  <div className="col">
                    <h3 className="f-w-300">26</h3>
                    <span className="d-block text-uppercase">total locations</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg={4}>
            <Card className="card-event">
              <Card.Body>
                <div className="row align-items-center justify-content-center">
                  <div className="col">
                    <h5 className="m-0">Upcoming Event</h5>
                  </div>
                  <div className="col-auto">
                    <label className="label theme-bg2 text-white f-14 f-w-400 float-end">34%</label>
                  </div>
                </div>
                <h2 className="mt-2 f-w-300">
                  45<sub className="text-muted f-14">Competitors</sub>
                </h2>
                <h6 className="text-muted mt-3 mb-0">You can participate in event </h6>
                <i className="fa fa-angellist text-c-purple f-50" />
              </Card.Body>
            </Card>
            <Card>
              <Card.Body className="border-bottom">
                <div className="row d-flex align-items-center">
                  <div className="col-auto">
                    <i className="feather icon-zap f-30 text-c-green" />
                  </div>
                  <div className="col">
                    <h3 className="f-w-300">235</h3>
                    <span className="d-block text-uppercase">total ideas</span>
                  </div>
                </div>
              </Card.Body>
              <Card.Body>
                <div className="row d-flex align-items-center">
                  <div className="col-auto">
                    <i className="feather icon-map-pin f-30 text-c-blue" />
                  </div>
                  <div className="col">
                    <h3 className="f-w-300">26</h3>
                    <span className="d-block text-uppercase">total locations</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={8}>
            <Card className="Recent-Users">
              <Card.Header>
                <Card.Title as="h5">Recent Order</Card.Title>
              </Card.Header>
              <Card.Body className="px-0 py-2">
                <Table responsive hover className="recent-users">
                  <tbody>
                    {orders.map((order, index) => (
                      <tr className="unread" key={index}>
                        <td>
                          <img className="rounded-circle" style={{ width: '40px' }} src={avatar1} alt="activity-user" />
                        </td>
                        <td>
                          <h6 className="mb-1">{order.user.username}</h6>
                          <p className="m-0">{order.user.email}</p>
                        </td>
                        <td>{order.user.phone}</td> 
                        <td>{order.city}</td>
                        <td>{order.totalPrice}</td> 
                        <td>
                          <h6 className="text-muted">
                            <i className="fa fa-circle text-c-green f-10 m-r-15" />
                            {moment(order.dateCreated).format('Do MMMM YYYY')}
                          </h6>
                        </td>
                        <td>
                              <Form.Select
                                value={order.status}
                                onChange={(e) => orderUpdate(order._id, e.target.value)}
                                >
                                <option value="Pending">Pending</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                            </Form.Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
          
        </Row>
      </div>
    </>
  );
};

export default DashDefault;
