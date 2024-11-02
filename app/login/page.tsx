'use client';

import React, { useState } from 'react';
import { TextField, Button, Typography, Alert, Modal, Box, Container } from '@mui/material';
import bcrypt from 'bcryptjs';

const LoginPage: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

    if (storedUser.email === email && bcrypt.compareSync(password, storedUser.password)) {
      const token = 'teste-token';
      localStorage.setItem('token', token);
      window.location.href = '/main';
    } else {
      setError('Email ou senha inválidos!');
    }
  };

  const handleRegister = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Todos os campos são obrigatórios!');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = { name, email, password: hashedPassword };
    localStorage.setItem('user', JSON.stringify(user));
    setModalOpen(true);
    resetForm();
    setError('');
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setIsRegistering(false);
    setEmail(email);
    setPassword(password);
  };

  return (
    <Container maxWidth={false} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', bgcolor: 'grey.100' }}>
      <Typography variant="h3" sx={{ mb: 4 }}>Banco Digital</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="fieldset" sx={{ border: '2px solid', borderColor: 'grey.300', borderRadius: 1, p: 3, width: '100%', maxWidth: 400 }}>
        <Typography variant="h5" component="legend" sx={{ fontWeight: 'bold', mb: 2 }}>{isRegistering ? 'Cadastro' : 'Login'}</Typography>

        {isRegistering && (
          <TextField
            label="Nome"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
        )}
        <TextField
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Senha"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          sx={{ mb: 2 }}
        />
        {isRegistering && (
          <TextField
            label="Confirmação de Senha"
            type="password"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
        )}
        <Button variant="contained" color="primary" onClick={isRegistering ? handleRegister : handleLogin} fullWidth sx={{ mb: 2 }}>
          {isRegistering ? 'Cadastrar' : 'Entrar'}
        </Button>
        <Button onClick={() => setIsRegistering(!isRegistering)} fullWidth>
          {isRegistering ? 'Já tem uma conta? Faça login' : 'Não tem conta? Crie uma'}
        </Button>
      </Box>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', bgcolor: 'background.paper', p: 4, borderRadius: 1, boxShadow: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Cadastro realizado com sucesso!</Typography>
          <Button variant="contained" onClick={handleCloseModal}>
            Fechar
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default LoginPage;
