import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Container, 
  Box, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  useMediaQuery,
  useTheme,
  Typography,
  Menu,
  MenuItem,
  Collapse,
  ListItemIcon
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Close as CloseIcon, 
  Bloodtype, 
  ExpandLess,
  ExpandMore,
  Person,
  LocalHospital,
  VolunteerActivism,
  Login
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // --- State for Register Dropdowns ---
  const [registerAnchorEl, setRegisterAnchorEl] = useState(null);
  const [mobileRegisterOpen, setMobileRegisterOpen] = useState(false);

  // --- NEW: State for Login Dropdowns ---
  const [loginAnchorEl, setLoginAnchorEl] = useState(null);
  const [mobileLoginOpen, setMobileLoginOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const openRegisterMenu = Boolean(registerAnchorEl);
  const openLoginMenu = Boolean(loginAnchorEl);

  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'About', path: '/about' },
    { title: 'Contact Us', path: '/contact' }
  ];

  // --- Scroll Logic ---
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Handlers ---
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  // --- REGISTER HANDLERS ---
  const handleRegisterClick = (event) => setRegisterAnchorEl(event.currentTarget);
  const handleRegisterClose = () => setRegisterAnchorEl(null);
  const handleRegisterNavigation = (path) => {
    navigate(path);
    setRegisterAnchorEl(null);
    setMobileOpen(false);
  };
  const handleMobileRegisterToggle = () => setMobileRegisterOpen(!mobileRegisterOpen);

  // --- NEW: LOGIN HANDLERS ---
  const handleLoginClick = (event) => setLoginAnchorEl(event.currentTarget);
  const handleLoginClose = () => setLoginAnchorEl(null);
  const handleLoginNavigation = (path) => {
    navigate(path);
    setLoginAnchorEl(null);
    setMobileOpen(false);
  };
  const handleMobileLoginToggle = () => setMobileLoginOpen(!mobileLoginOpen);


  // --- Mobile Drawer Content ---
  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={() => handleNavigation('/')}>
          <Bloodtype sx={{ color: '#d32f2f', fontSize: 32, mr: 1 }} />
          <Typography variant="h6" fontWeight="bold" color="#1e293b">
            BloodLink
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Main Links */}
      <List sx={{ flexGrow: 1 }}>
        {navLinks.map((item) => (
          <ListItem key={item.title} disablePadding sx={{ mb: 1 }}>
            <ListItemButton 
              onClick={() => handleNavigation(item.path)}
              sx={{ borderRadius: 2 }}
            >
              <ListItemText 
                primary={item.title} 
                primaryTypographyProps={{ fontWeight: 600, fontSize: '1.1rem' }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Action Buttons (Mobile) */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        
        {/* Mobile Login Dropdown */}
        <Box>
          <Button 
            variant="outlined" 
            className="btn-login" 
            fullWidth 
            onClick={handleMobileLoginToggle}
            endIcon={mobileLoginOpen ? <ExpandLess /> : <ExpandMore />}
          >
            Log In
          </Button>
          <Collapse in={mobileLoginOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ mt: 1, bgcolor: '#f8fafc', borderRadius: 2 }}>
              <ListItemButton onClick={() => handleLoginNavigation('/login/user')} sx={{ pl: 4 }}>
                <ListItemIcon><Person fontSize="small" color="secondary" /></ListItemIcon>
                <ListItemText primary="User Login" />
              </ListItemButton>
              <ListItemButton onClick={() => handleLoginNavigation('/login/donor')} sx={{ pl: 4 }}>
                <ListItemIcon><VolunteerActivism fontSize="small" color="secondary" /></ListItemIcon>
                <ListItemText primary="Donor Login" />
              </ListItemButton>
              <ListItemButton onClick={() => handleLoginNavigation('/login/hospital')} sx={{ pl: 4 }}>
                <ListItemIcon><LocalHospital fontSize="small" color="secondary" /></ListItemIcon>
                <ListItemText primary="Hospital Login" />
              </ListItemButton>
            </List>
          </Collapse>
        </Box>

        {/* Mobile Register Dropdown */}
        <Box>
          <Button 
            variant="contained" 
            className="btn-register" 
            fullWidth 
            onClick={handleMobileRegisterToggle}
            endIcon={mobileRegisterOpen ? <ExpandLess /> : <ExpandMore />}
          >
            Register
          </Button>
          <Collapse in={mobileRegisterOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ mt: 1, bgcolor: '#f8fafc', borderRadius: 2 }}>
              <ListItemButton onClick={() => handleRegisterNavigation('/register/user')} sx={{ pl: 4 }}>
                <ListItemIcon><Person fontSize="small" color="primary" /></ListItemIcon>
                <ListItemText primary="As User" />
              </ListItemButton>
              <ListItemButton onClick={() => handleRegisterNavigation('/register/donor')} sx={{ pl: 4 }}>
                <ListItemIcon><VolunteerActivism fontSize="small" color="primary" /></ListItemIcon>
                <ListItemText primary="As Donor" />
              </ListItemButton>
              <ListItemButton onClick={() => handleRegisterNavigation('/register/hospital')} sx={{ pl: 4 }}>
                <ListItemIcon><LocalHospital fontSize="small" color="primary" /></ListItemIcon>
                <ListItemText primary="As Hospital" />
              </ListItemButton>
            </List>
          </Collapse>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        className={`navbar-root ${scrolled ? 'navbar-scrolled' : ''}`}
        elevation={0}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: '100%', display: 'flex', justifyContent: 'space-between' }}>
            
            {/* 1. Logo */}
            <Box 
              className="brand-logo" 
              onClick={() => handleNavigation('/')}
              sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            >
              <Bloodtype sx={{ fontSize: 40, color: '#d32f2f', mr: 0.5 }} />
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
                BLOOD<span className="brand-highlight">LINK</span>
              </Typography>
            </Box>

            {/* 2. Desktop Links */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {navLinks.map((item) => (
                  <Button 
                    key={item.title} 
                    disableRipple 
                    className="nav-link"
                    onClick={() => handleNavigation(item.path)}
                  >
                    {item.title}
                  </Button>
                ))}
              </Box>
            )}

            {/* 3. Desktop Buttons & Dropdowns */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                
                {/* --- LOGIN DROPDOWN --- */}
                <Button 
                  className="btn-login" 
                  variant="outlined"
                  endIcon={openLoginMenu ? <ExpandLess /> : <ExpandMore />}
                  onClick={handleLoginClick}
                >
                  Log In
                </Button>
                <Menu
                  anchorEl={loginAnchorEl}
                  open={openLoginMenu}
                  onClose={handleLoginClose}
                  MenuListProps={{ 'aria-labelledby': 'login-button' }}
                  PaperProps={{
                    elevation: 3,
                    sx: { mt: 1.5, borderRadius: 3, minWidth: 180 }
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={() => handleLoginNavigation('/login/user')} sx={{ py: 1.5 }}>
                    <Person sx={{ mr: 2, color: '#d32f2f', fontSize: 20 }} /> User
                  </MenuItem>
                  <MenuItem onClick={() => handleLoginNavigation('/login/donor')} sx={{ py: 1.5 }}>
                    <VolunteerActivism sx={{ mr: 2, color: '#d32f2f', fontSize: 20 }} /> Donor 
                  </MenuItem>
                  <MenuItem onClick={() => handleLoginNavigation('/login/hospital')} sx={{ py: 1.5 }}>
                    <LocalHospital sx={{ mr: 2, color: '#d32f2f', fontSize: 20 }} /> Hospital 
                  </MenuItem>
                </Menu>
                
                {/* --- REGISTER DROPDOWN --- */}
                <Button 
                  className="btn-register" 
                  variant="contained"
                  endIcon={openRegisterMenu ? <ExpandLess /> : <ExpandMore />}
                  onClick={handleRegisterClick}
                >
                  Register
                </Button>
                <Menu
                  anchorEl={registerAnchorEl}
                  open={openRegisterMenu}
                  onClose={handleRegisterClose}
                  MenuListProps={{ 'aria-labelledby': 'register-button' }}
                  PaperProps={{
                    elevation: 3,
                    sx: { mt: 1.5, borderRadius: 3, minWidth: 180 }
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={() => handleRegisterNavigation('/register/user')} sx={{ py: 1.5 }}>
                    <Person sx={{ mr: 2, color: '#d32f2f', fontSize: 20 }} /> User
                  </MenuItem>
                  <MenuItem onClick={() => handleRegisterNavigation('/register/donor')} sx={{ py: 1.5 }}>
                    <VolunteerActivism sx={{ mr: 2, color: '#d32f2f', fontSize: 20 }} /> Donor
                  </MenuItem>
                  <MenuItem onClick={() => handleRegisterNavigation('/register/hospital')} sx={{ py: 1.5 }}>
                    <LocalHospital sx={{ mr: 2, color: '#d32f2f', fontSize: 20 }} /> Hospital
                  </MenuItem>
                </Menu>
              </Box>
            )}

            {/* 4. Mobile Toggle */}
            {isMobile && (
              <IconButton 
                onClick={handleDrawerToggle}
                sx={{ color: '#1e293b' }}
              >
                <MenuIcon sx={{ fontSize: 32 }} />
              </IconButton>
            )}

          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        PaperProps={{ className: 'mobile-drawer-paper' }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Navbar;