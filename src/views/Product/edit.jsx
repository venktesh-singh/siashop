import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Image } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../../config/apiurl';

function ProductUpdate() {
    const location = useLocation();
    const productFromLocation = location.state?.prod;
    const productCat = location?.state?.cat_name;
    const productSubcat = location?.state?.subcat_name;
    const id = productFromLocation?._id;
    const [updateProduct, setUpdateProduct] = useState({
        product_gallery: [],  
        ...productFromLocation 
    });
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    //console.log("Check SubCategory", productSubcat);
    const handleBackButtonClick = () => {
        navigate(-1);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${BASE_URL}/categories/`);
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

    const handleCategoryChange = async (e) => {
        const categoryId = e.target.value;
        setUpdateProduct(prevProduct => ({
            ...prevProduct,
            category: categoryId,
            subcategory: '', // Clear subcategory when changing category
        }));
        await fetchSubcategories(categoryId);
    };

    const fetchSubcategories = async (categoryId) => {
        try {
            const response = await fetch(`${BASE_URL}/subcategories/category/${categoryId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch subcategories');
            }
            const data = await response.json();
            setSubcategories(data);
        } catch (error) {
            console.error("An error occurred while fetching subcategories:", error);
        }
    };

    const handleSubcategoryChange = (e) => {
        const subcategoryId = e.target.value;
        setUpdateProduct(prevProduct => ({
            ...prevProduct,
            subcategory: subcategoryId
        }));
    };

    useEffect(() => {
        if (productFromLocation) {
            setUpdateProduct(prevProduct => ({
                ...prevProduct,
                category: productFromLocation.productCat || '',
                subcategory: productFromLocation.productSubcat || '',
            }));
            fetchSubcategories(productFromLocation.productCat || '');
        }
    }, [productFromLocation]);

    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUpdateProduct((prevProduct) => ({
                ...prevProduct,
                product_img: file
            }));
        }
    };
    
    // Function to handle multiple image uploads
    const handleMultipleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        setUpdateProduct((prevProduct) => ({
            ...prevProduct,
            product_gallery: files
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdateProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();

            // Append product_gallery files
            updateProduct.product_gallery.forEach(file => {
                formData.append('product_gallery', file);
            });

            // Append product_img if it exists
            if (updateProduct.product_img) {
                formData.append('product_img', updateProduct.product_img);
            }

            // Append other fields
            Object.keys(updateProduct).forEach(key => {
                if (key !== 'product_gallery' && key !== 'product_img') {
                    formData.append(key, updateProduct[key]);
                }
            });

            const response = await fetch(`${BASE_URL}/products/edit/${id}`, {
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update product');
            }

            const data = await response.json();
            console.log('Product updated successfully:', data);
            toast.success('Product updated successfully!', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            navigate(-1);
        } catch (error) {
            console.error('Error updating product:', error.message);
            toast.error('Error updating product: ' + error.message, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    };

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
                                    <Card.Title as="h5">Update Product</Card.Title>
                                </Col>
                                <Col md="auto">
                                    <Button
                                        className="mb-2"
                                        variant="primary"
                                        onClick={handleBackButtonClick}>
                                        <FiArrowLeft style={{ marginRight: '5px', fontSize: '15px' }} /> Back
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Header>
                        <Card.Body>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            <Form onSubmit={handleSubmit} encType='multipart/form-data'>
                                <Row className="mb-row">  
                                    <Col md={4}>
                                        <Form.Group controlId="formProductName">
                                            <Form.Label>Product Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Product Name"
                                                name="product_name"
                                                value={updateProduct.product_name || ''}
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
                                                value={updateProduct.countInStock || ''}
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
                                                value={updateProduct.brand || ''}
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
                                                value={updateProduct.description || ''}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group controlId="formNumReviews">
                                            <Form.Label>Number of Reviews</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter Number of Reviews"
                                                name="numReviews"
                                                value={updateProduct.numReviews || ''}
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
                                                value={updateProduct.price || ''}
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
                                                value={updateProduct.rating || ''}
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
                                                value={updateProduct.richDescription || ''}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group controlId="formIsFeatured">
                                            <Form.Label>Is Featured?</Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="isFeatured"
                                                value={updateProduct.isFeatured || ''}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Featured Option</option>
                                                <option value="true">True</option>
                                                <option value="false">False</option>
                                            </Form.Control>
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
                                                    value={updateProduct.category || ''}
                                                    onChange={handleCategoryChange}
                                                    required
                                                >
                                                    <option value="">Select Category</option>
                                                    {categories.map((cat) => (
                                                        <option key={cat._id} value={cat._id}>
                                                            {cat.cat_name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group controlId="formSubcategory">
                                            <Form.Label>Subcategory</Form.Label>
                                                <Form.Select
                                                    as="select"
                                                    name="subcategory"
                                                    value={updateProduct.subcategory || ''}
                                                    onChange={handleSubcategoryChange}
                                                    required
                                                >
                                                    <option value="">Select Subcategory</option>
                                                    {subcategories.map((subcat) => (
                                                        <option key={subcat._id} value={subcat._id}>
                                                            {subcat.subcat_name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group controlId="formProductImage">
                                            <Form.Label>Product Image</Form.Label>
                                            <Form.Control
                                                type="file"
                                                name="product_img"
                                                accept="image/*"
                                                onChange={handleImageSelect}
                                            />
                                            {updateProduct.product_img && (
                                                <Image
                                                    src={typeof updateProduct.product_img === 'string'
                                                        ? updateProduct.product_img
                                                        : URL.createObjectURL(updateProduct.product_img)}
                                                    alt="Product Preview"
                                                    fluid
                                                    className="mt-2"
                                                    style={{ width: '120px', height: 'auto' }}
                                                />
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-row">
                                    <Col md={4}>
                                        <Form.Group controlId="formProductGallery">
                                            <Form.Label>Product Gallery Images</Form.Label>
                                            <Form.Control
                                                type="file"
                                                name="product_gallery"
                                                accept="image/*"
                                                multiple
                                                onChange={handleMultipleImageUpload}
                                            />
                                            <div className="mt-2">
                                            {updateProduct.product_gallery.length > 0 && updateProduct.product_gallery.map((file, index) => (
                                                <Image
                                                    key={index}
                                                    src={typeof file === 'string'
                                                        ? file
                                                        : URL.createObjectURL(file)}
                                                    alt={`Gallery Image ${index + 1}`}
                                                    fluid
                                                    className="mr-2"
                                                    style={{ width: '80px', height: 'auto' }}
                                                />
                                            ))}
                                            </div>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Button variant="primary" type="submit">
                                    Update Product
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default ProductUpdate;
