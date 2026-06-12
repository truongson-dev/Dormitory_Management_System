import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../../Redux/Actions/authActions';
import { Container, Card, CardBody, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Xử lý khi submit form đăng ký
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        
        // Kiểm tra mật khẩu khớp nhau
        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp!');
            return;
        }

        try {
            await dispatch(register({ username, password }));
            setSuccess('Đăng ký thành công! Hãy đăng nhập.');
            setTimeout(() => navigate('/login'), 2000); // Chuyển về trang đăng nhập sau 2s
        } catch (err) {
            setError(err.response?.data || 'Đăng ký thất bại.');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Card style={{ width: '400px' }} className="shadow">
                <CardBody className="p-5">
                    <h2 className="text-center mb-4 text-primary-custom fw-bold">Đăng Ký Sinh Viên</h2>
                    {error && <Alert color="danger">{error}</Alert>}
                    {success && <Alert color="success">{success}</Alert>}
                    
                    <Form onSubmit={handleRegister}>
                        <FormGroup>
                            <Label>Tên đăng nhập</Label>
                            <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </FormGroup>
                        <FormGroup>
                            <Label>Mật khẩu</Label>
                            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </FormGroup>
                        <FormGroup>
                            <Label>Xác nhận mật khẩu</Label>
                            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </FormGroup>
                        <Button color="primary" className="btn-primary-custom w-100 mt-3" type="submit">
                            Đăng ký
                        </Button>
                    </Form>
                    <div className="text-center mt-3">
                        <small>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></small>
                    </div>
                </CardBody>
            </Card>
        </Container>
    );
};

export default Register;
