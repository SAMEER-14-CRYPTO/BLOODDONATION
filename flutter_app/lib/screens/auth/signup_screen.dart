import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});
  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameC = TextEditingController();
  final _emailC = TextEditingController();
  final _phoneC = TextEditingController();
  final _passC = TextEditingController();
  final _cityC = TextEditingController();
  String _bloodGroup = 'O+';
  String _gender = 'Male';
  int _age = 25;

  final _bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    return Scaffold(
      appBar: AppBar(title: const Text('Register')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text('Become a Donor', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800)),
                const SizedBox(height: 8),
                Text('Register and start saving lives', style: TextStyle(color: Colors.grey[600])),
                const SizedBox(height: 28),
                TextFormField(controller: _nameC, decoration: const InputDecoration(labelText: 'Full Name', prefixIcon: Icon(Icons.person_outline)), validator: (v) => v!.isEmpty ? 'Required' : null),
                const SizedBox(height: 14),
                TextFormField(controller: _emailC, decoration: const InputDecoration(labelText: 'Email', prefixIcon: Icon(Icons.email_outlined)), validator: (v) => v!.isEmpty ? 'Required' : null),
                const SizedBox(height: 14),
                TextFormField(controller: _phoneC, decoration: const InputDecoration(labelText: 'Phone', prefixIcon: Icon(Icons.phone_outlined))),
                const SizedBox(height: 14),
                TextFormField(controller: _passC, obscureText: true, decoration: const InputDecoration(labelText: 'Password', prefixIcon: Icon(Icons.lock_outline)), validator: (v) => v!.length < 6 ? 'Min 6 chars' : null),
                const SizedBox(height: 14),
                Row(children: [
                  Expanded(child: DropdownButtonFormField<String>(value: _bloodGroup, decoration: const InputDecoration(labelText: 'Blood Group'), items: _bloodGroups.map((g) => DropdownMenuItem(value: g, child: Text(g))).toList(), onChanged: (v) => setState(() => _bloodGroup = v!))),
                  const SizedBox(width: 14),
                  Expanded(child: DropdownButtonFormField<String>(value: _gender, decoration: const InputDecoration(labelText: 'Gender'), items: ['Male', 'Female', 'Other'].map((g) => DropdownMenuItem(value: g, child: Text(g))).toList(), onChanged: (v) => setState(() => _gender = v!))),
                ]),
                const SizedBox(height: 14),
                Row(children: [
                  Expanded(child: TextFormField(initialValue: '25', keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Age'), onChanged: (v) => _age = int.tryParse(v) ?? 25)),
                  const SizedBox(width: 14),
                  Expanded(child: TextFormField(controller: _cityC, decoration: const InputDecoration(labelText: 'City'))),
                ]),
                const SizedBox(height: 28),
                ElevatedButton(
                  onPressed: auth.isLoading ? null : () async {
                    if (_formKey.currentState!.validate()) {
                      final success = await auth.signup(
                        fullName: _nameC.text, email: _emailC.text, password: _passC.text,
                        phone: _phoneC.text, bloodGroup: _bloodGroup, gender: _gender,
                        age: _age, city: _cityC.text,
                      );
                      if (success && mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Account created!')));
                        Navigator.pushReplacementNamed(context, '/home');
                      }
                    }
                  },
                  style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16)),
                  child: auth.isLoading ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)) : const Text('Create Account'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
