import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../Redux/Actions/authActions';
import { Container, Card, CardBody, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Hook chuyển trang

    // Xử lý khi submit form đăng nhập
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const user = await dispatch(login(username, password));
            // Dựa vào role để chuyển hướng
            if (user.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/student');
            }
        } catch (err) {
            setError(err.response?.data || 'Đăng nhập thất bại. Kiểm tra lại thông tin.');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Card style={{ width: '400px' }} className="shadow">
                <CardBody className="p-5">
                    <h2 className="text-center mb-4 text-primary-custom fw-bold">Đăng Nhập</h2>
                    {error && <Alert color="danger">{error}</Alert>}
                    <Form onSubmit={handleLogin}>
                        <FormGroup>
                            <Label>Tên đăng nhập</Label>
                            <Input 
                                type="text" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                required 
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Mật khẩu</Label>
                            <Input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </FormGroup>
                        <Button color="primary" className="btn-primary-custom w-100 mt-3" type="submit">
                            Đăng nhập
                        </Button>
                    </Form>
                    <div className="text-center mt-3">
                        <small>Bạn chưa có tài khoản? <Link to="/register">Đăng ký sinh viên mới</Link></small>
                    </div>
                </CardBody>
            </Card>
        </Container>
    );
};

export default Login;
