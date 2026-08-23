import 'package:flutter_test/flutter_test.dart';
import 'package:lifelink/main.dart';

void main() {
  testWidgets('LifeLink App launches and shows splash text', (WidgetTester tester) async {
    // Build our app
    await tester.pumpWidget(const LifeLinkApp());

    // Verify that the title 'LifeLink' is rendered
    expect(find.text('LifeLink'), findsOneWidget);
    expect(find.text('Smart Blood Donor Finder'), findsOneWidget);

    // Drain timers to avoid pending timer assertions
    await tester.pumpAndSettle(const Duration(seconds: 4));
  });
}
