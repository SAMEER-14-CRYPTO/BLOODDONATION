import 'package:url_launcher/url_launcher.dart';

/// Maps Helper Service — No Google Maps SDK dependency
/// Uses url_launcher to open maps in browser/app.
class MapsService {
  /// Open navigation in Google Maps app/browser
  static Future<void> openNavigation(double latitude, double longitude) async {
    final String googleMapsUrl = 'https://www.google.com/maps/dir/?api=1&destination=$latitude,$longitude';

    if (await canLaunchUrl(Uri.parse(googleMapsUrl))) {
      await launchUrl(Uri.parse(googleMapsUrl), mode: LaunchMode.externalApplication);
    } else {
      throw 'Could not launch maps navigation.';
    }
  }

  /// Open location in Google Maps
  static Future<void> openLocation(double latitude, double longitude, {String? label}) async {
    final String url = label != null
        ? 'https://www.google.com/maps/search/?api=1&query=$latitude,$longitude&query_place_id=$label'
        : 'https://www.google.com/maps/@$latitude,$longitude,15z';

    if (await canLaunchUrl(Uri.parse(url))) {
      await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
    }
  }
}
