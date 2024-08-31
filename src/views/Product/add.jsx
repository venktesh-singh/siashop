import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddProduct = () => {
    const [addProduct, setAddProduct] = useState({
        product_img: null, product_gallery: []
    });
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleBackButtonClick = () => {
        navigate(-1);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/v1/categories/');
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const data = await response.json();
                setCategories(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchCategories();
    }, []);

    const fetchSubcategories = async (categoryId) => {
        try {
            const response = await fetch(`http://localhost:4000/api/v1/subcategories/category/${categoryId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch subcategories');
            }
            const data = await response.json();
            setSubcategories(data);
        } catch (error) {
            console.error("An error occurred while fetching subcategories:", error);
        }
    };

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setAddProduct((prevProduct) => ({ ...prevProduct, category: categoryId, subcategory: '' }));
        fetchSubcategories(categoryId);
    };

    const handleSubcategoryChange = (e) => {
        const subcategoryId = e.target.value;
        setAddProduct((prevProduct) => ({ ...prevProduct, subcategory: subcategoryId }));
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        console.log("Selected file:", file);
        setAddProduct((prevProduct) => ({
            ...prevProduct,
            product_img: file
        }));
    };

    const handleMultipleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        console.log("Slect Multiple Files:",files); 
        setAddProduct((prevProduct) => ({
            ...prevProduct,
            product_gallery: files
        }));
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(addProduct).forEach((key) => {
                if (key === 'product_gallery') {
                    addProduct[key].forEach((file) => {
                        formData.append('product_gallery', file);
                    });
                } else {
                    formData.append(key, addProduct[key]);
                }
            });
    
            const response = await fetch("http://localhost:4000/api/v1/products/add", {
                method: 'POST',
                body: formData
            });
    
            if (!response.ok) {
                throw new Error('Failed to add product');
            }
    
            const data = await response.json();
            console.log('Product added successfully:', data);
            toast.success('Product added successfully!', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            navigate(-1); // Optionally navigate back after successful submission
        } catch (error) {
            console.error('Error adding product:', error.message);
        }
    };
    
    //console.log("Add New Product:",addProduct)
    return (
        <>
            <style type="text/css">
                {`
                .mb-row {
                    margin-bottom: 1rem; /* Adjust the value as needed */
                }
                `}
            </style>
            <Row className="justify-content-md-center mt-4">
                <ToastContainer
                    position="top-center"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
                <Col md={12}>
                    <Card className="user-list">
                        <Card.Header>
                            <Row className="align-items-center mb-row">
                                <Col>
                                    <Card.Title as="h5">Add Product</Card.Title>
                                </Col>
                                <Col md="auto">
                                    <Button
                                        className="mb-2"
                                        variant="primary"
                                        onClick={handleBackButtonClick}
                                    >
                                        <FiArrowLeft style={{ marginRight: '5px', fontSize: '15px' }} /> Back
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Header>
                        <Card.Body>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            <Form onSubmit={handleSubmit} encType="multipart/form-data">
                                <Row className="mb-row">
                                    <Col md={4}>
                                        <Form.Group controlId="formProductName">
                                            <Form.Label>Product Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Product Name"
                                                name="name"
                                                value={addProduct.product_name || ''}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group controlId="formCountInStock">
                                            <Form.Label>Count In Stock</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter Count In Stock"
                                                name="countInStock"
                                                value={addProduct.countInStock || ''}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group controlId="formBrand">
                                            <Form.Label>Brand</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Brand Name"
                                                name="brand"
                                                value={addProduct.brand || ''}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-row">
                                    <Col md={4}>
                                        <Form.Group controlId="formDescription">
                                            <Form.Label>Description</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                placeholder="Enter Product Description"
                                                name="description"
                                                value={addProduct.description || ''}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group controlId="formNumReviews">
                                            <Form.Label>Number of Reviews</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter Number Reviews"
                                                name="numReviews"
                                                value={addProduct.numReviews || ''}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group controlId="formPrice">
                                            <Form.Label>Price</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter Price"
                                                name="price"
                                                value={addProduct.price || ''}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-row">
                                    <Col md={4}>
                                        <Form.Group controlId="formRating">
                                            <Form.Label>Rating</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter Product Rating"
                                                name="rating"
                                                value={addProduct.rating || ''}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group controlId="formRichDescription">
                                            <Form.Label>Long Description</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                placeholder="Enter Product Long Description"
                                                name="richDescription"
                                                value={addProduct.richDescription || ''}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-row">
                                    <Col md={4}>
                                        <Form.Group controlId="formCategory">
                                            <Form.Label>Category</Form.Label>
                                            <Form.Select
                                                as="select"
                                                name="category"
                                                value={addProduct.category || ''}
                                                onChange={handleCategoryChange}
                                            >
                                                <option value="">Please Select Category</option>
                                                {categories.map((category) => (
                                                    <option key={category._id} value={category._id}>
                                                        {category.cat_name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group controlId="formSubCategory">
                                            <Form.Label>Sub Category</Form.Label>
                                            <Form.Select
                                                as="select"
                                                name="subcategory"
                                                value={addProduct.subcategory || ''}
                                                onChange={handleSubcategoryChange}
                                            >
                                                <option value="">Please Select Sub Category</option>
                                                {subcategories.map((subcategory) => (
                                                    <option key={subcategory._id} value={subcategory._id}>
                                                        {subcategory.subcat_name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group controlId="formImage">
                                            <Form.Label>Upload Product Pic</Form.Label>
                                            <Form.Control
                                                type="file"
                                                name="product_img"
                                                onChange={handleImageSelect}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-row">  
                                    <Col md={4}>
                                        <Form.Group controlId="formImage">
                                            <Form.Label>Upload Gallery Images</Form.Label>
                                            <Form.Control
                                                multiple
                                                type="file"
                                                name="product_gallery"
                                                onChange={handleMultipleImageUpload}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group controlId="formMetaTitle">
                                            <Form.Label>Meta Title</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Product Meta Title"
                                                name="metaTitle"
                                                value={addProduct.metaTitle || ''}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group controlId="formMetaDescription">
                                            <Form.Label>Meta Description</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                placeholder="Enter Product Meta Description"
                                                name="metaDescription"
                                                value={addProduct.metaDescription || ''}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Button type="submit" className="mt-3">Submit</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default AddProduct;
