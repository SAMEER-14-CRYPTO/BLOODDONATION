import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../utils/theme.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailC = TextEditingController(text: 'rahul@demo.com');
  final _passC = TextEditingController(text: 'demo123');
  final _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 40),
                const Center(child: Text('🩸', style: TextStyle(fontSize: 60))),
                const SizedBox(height: 16),
                const Text('Welcome Back', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800), textAlign: TextAlign.center),
                const SizedBox(height: 8),
                Text('Login to your LifeLink account', style: TextStyle(color: Colors.grey[600], fontSize: 16), textAlign: TextAlign.center),
                const SizedBox(height: 40),
                TextFormField(
                  controller: _emailC,
                  decoration: const InputDecoration(labelText: 'Email', prefixIcon: Icon(Icons.email_outlined)),
                  validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _passC,
                  obscureText: true,
                  decoration: const InputDecoration(labelText: 'Password', prefixIcon: Icon(Icons.lock_outline)),
                  validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                ),
                Align(
                  alignment: Alignment.centerRight,
                  child: TextButton(
                    onPressed: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Password reset email sent (demo)'))),
                    child: const Text('Forgot Password?'),
                  ),
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: auth.isLoading ? null : () async {
                    if (_formKey.currentState!.validate()) {
                      final success = await auth.login(_emailC.text, _passC.text);
                      if (success && mounted) {
                        Navigator.pushReplacementNamed(context, auth.isAdmin ? '/admin' : '/home');
                      }
                    }
                  },
                  style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16)),
                  child: auth.isLoading ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)) : const Text('Login'),
                ),
                const SizedBox(height: 24),
                Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                  Text("Don't have an account? ", style: TextStyle(color: Colors.grey[600])),
                  GestureDetector(onTap: () => Navigator.pushNamed(context, '/signup'), child: const Text('Register', style: TextStyle(color: AppTheme.primary, fontWeight: FontWeight.w700))),
                ]),
                const SizedBox(height: 32),
                // Demo buttons
                const Divider(),
                const SizedBox(height: 8),
                Text('Quick Demo Login', style: TextStyle(color: Colors.grey[500], fontSize: 13), textAlign: TextAlign.center),
                const SizedBox(height: 8),
                Row(children: [
                  Expanded(child: OutlinedButton(onPressed: () { _emailC.text = 'rahul@demo.com'; _passC.text = 'demo'; }, child: const Text('Donor', style: TextStyle(fontSize: 13)))),
                  const SizedBox(width: 12),
                  Expanded(child: OutlinedButton(onPressed: () { _emailC.text = 'admin@lifelink.com'; _passC.text = 'admin'; }, child: const Text('Admin', style: TextStyle(fontSize: 13)))),
                ]),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
