document.addEventListener('DOMContentLoaded',
  ()=>{
    const loginForm=$('#login-form'),
    signupForm=$('#signup-form'),
    loginTab=$('#login-tab'),
    signupTab=$('#signup-tab'),
    adminCodeField=$('#admin-code-field'),
    roleInputs=$$('input[name="role"]');
    const selectTab=tab=>{
      const login=tab==='login';
      loginForm.classList.toggle('hidden',
        !login);
      signupForm.classList.toggle('hidden',
        login);
      loginTab.classList.toggle('active',
        login);
      signupTab.classList.toggle('active',
        !login);
      loginTab.setAttribute('aria-selected',
        String(login));
      signupTab.setAttribute('aria-selected',
        String(!login))
    };
    loginTab.addEventListener('click',
      ()=>selectTab('login'));
    signupTab.addEventListener('click',
      ()=>selectTab('signup'));
    roleInputs.forEach(input=>input.addEventListener('change',
        ()=>{
          const admin=$('input[name="role"]:checked').value==='admin';
          adminCodeField.classList.toggle('hidden',
            !admin);
          adminCodeField.querySelector('input').required=admin
        }));
const hashPassword=async password=>{
      if(!window.crypto?.subtle)throw new Error('Secure password hashing is not available in this browser context. Open this project in a modern browser or local web server.');
      const digest=await crypto.subtle.digest('SHA-256',
        new TextEncoder().encode(password));
      return[...new Uint8Array(digest)].map(byte=>byte.toString(16).padStart(2,
          '0')).join('')
    };
loginForm.addEventListener('submit',
      async event=>{
        event.preventDefault();
        const form=event.currentTarget,
        data=Object.fromEntries(new FormData(form)),
        email=data.email.trim().toLowerCase();
        if(!email||!/^\S+@\S+\.\S+$/.test(email)||!data.password){
          showAlert('Check your login details',
            'Enter a valid email address and password.',
            'warning');
          return
        }
        try{
          const hash=await hashPassword(data.password),
          user=Store.users().find(item=>item.email.toLowerCase()===email&&item.passwordHash===hash);
          if(!user){
            showAlert('Login failed',
              'The email or password is incorrect.',
              'error');
            return
          }
          const signedIn=user.role==='admin'?new Administrator(user):new Customer(user);
          Store.saveUser(signedIn);
          location.href=user.role==='admin'?'admin.html':'index.html'
        }
        catch(error){
          showAlert('Unable to log in',
            error.message,
            'error')
        }
      });
signupForm.addEventListener('submit',
      async event=>{
        event.preventDefault();
        const form=event.currentTarget,
        data=Object.fromEntries(new FormData(form)),
        name=data.name.trim(),
        email=data.email.trim().toLowerCase(),
        phone=data.phone.trim(),
        role=data.role==='admin'?'admin':'client';
        if(name.length<2){
          showAlert('Check your details',
            'Enter your full name.',
            'warning');
          return
        }
        if(!/^\S+@\S+\.\S+$/.test(email)){
          showAlert('Invalid email',
            'Enter a valid email address.',
            'warning');
          return
        }
        if(!phone){
          showAlert('Check your details',
            'Enter your phone number.',
            'warning');
          return
        }
        if(Store.users().some(user=>user.email.toLowerCase()===email)){
          showAlert('Email already registered',
            'Use a different email address or log in.',
            'error');
          return
        }
        if(data.password.length<6){
          showAlert('Password too short',
            'Your password must contain at least 6 characters.',
            'warning');
          return
        }
        if(data.password!==data.confirmPassword){
          showAlert('Passwords do not match',
            'Enter the same password in both password fields.',
            'warning');
          return
        }
        if(role==='admin'&&data.adminCode!==ADMIN_SECRET_CODE){
          showAlert('Invalid admin verification password',
            'Enter the correct admin verification password to create an admin account.',
            'error');
          return
        }
        try{
          const passwordHash=await hashPassword(data.password),
          userData={
            id:`user-${crypto.randomUUID?.()||`${
              Date.now()
            }-${
              Math.random().toString(16).slice(2)
            }`}`,
            name,
            email,
            phone,
            passwordHash
          },
          user=role==='admin'?new Administrator(userData):new Customer(userData);
          Store.saveUsers([...Store.users(),
            user]);
          Store.saveUser(user);
          await showAlert('Account created',
            `Welcome, ${name}. Your ${role} account is ready.`,
            'success');
          location.href=role==='admin'?'admin.html':'index.html'
        }
        catch(error){
          showAlert('Unable to create account',
            error.message,
            'error')
        }
      })
  });
