// LifeLink Verified Dataset for Android App
export const CityCoordinates = {
  'Chennai': { lat: 13.0827, lng: 80.2707 },
  'Coimbatore': { lat: 11.0168, lng: 76.9558 },
  'Madurai': { lat: 9.9252, lng: 78.1198 },
  'Trichy': { lat: 10.7905, lng: 78.7047 },
  'Salem': { lat: 11.6643, lng: 78.1460 },
  'Tirunelveli': { lat: 8.7139, lng: 77.7567 },
  'Vellore': { lat: 12.9165, lng: 79.1325 },
  'Puducherry': { lat: 11.9416, lng: 79.8083 },
  'Tirupati': { lat: 13.6288, lng: 79.4192 },
  'Vijayawada': { lat: 16.5062, lng: 80.6480 },
  'Visakhapatnam': { lat: 17.6868, lng: 83.2185 },
  'Guntur': { lat: 16.3067, lng: 80.4365 },
  'Nellore': { lat: 14.4426, lng: 79.9865 },
  'Kurnool': { lat: 15.8281, lng: 78.0373 },
  'Kadapa': { lat: 14.4673, lng: 78.8242 },
  'Rly Kodur': { lat: 14.0042, lng: 79.3512 },
  'Anantapur': { lat: 14.6819, lng: 77.6006 }
};

export const DonorsList = [
  { uid:'sameer_donor', displayName:'Sameer Shaik', bloodGroup:'B-', age:21, gender:'Male', city:'Rly Kodur', address:'Rly Kodur, AP', phone:'+91-9184000000', availability:true, verified:true, lastDonation:'2026-08-20', lat:14.0042, lng:79.3512 },
  { uid:'u1', displayName:'Karthik Iyer', bloodGroup:'O+', age:28, gender:'Male', city:'Chennai', address:'Anna Nagar, Chennai', phone:'+91-9876543210', availability:true, verified:true, lastDonation:'2026-07-15', lat:13.0827, lng:80.2707 },
  { uid:'u2', displayName:'Priya Lakshmi', bloodGroup:'A+', age:25, gender:'Female', city:'Coimbatore', address:'RS Puram, Coimbatore', phone:'+91-9876543211', availability:true, verified:true, lastDonation:'2026-06-20', lat:11.0168, lng:76.9558 },
  { uid:'u3', displayName:'Venkatesh Reddy', bloodGroup:'B+', age:30, gender:'Male', city:'Tirupati', address:'Alipiri Road, Tirupati', phone:'+91-9876543212', availability:true, verified:true, lastDonation:'2026-05-10', lat:13.6288, lng:79.4192 },
  { uid:'u4', displayName:'Anitha Devi', bloodGroup:'AB+', age:22, gender:'Female', city:'Madurai', address:'KK Nagar, Madurai', phone:'+91-9876543213', availability:true, verified:true, lastDonation:'2026-04-05', lat:9.9252, lng:78.1198 },
  { uid:'u5', displayName:'Sai Krishna', bloodGroup:'O-', age:32, gender:'Male', city:'Vijayawada', address:'Benz Circle, Vijayawada', phone:'+91-9876543214', availability:true, verified:true, lastDonation:'2026-06-01', lat:16.5062, lng:80.6480 },
  { uid:'u6', displayName:'Deepak Rao', bloodGroup:'A-', age:29, gender:'Male', city:'Visakhapatnam', address:'MVP Colony, Vizag', phone:'+91-9876543215', availability:true, verified:true, lastDonation:'2026-08-01', lat:17.6868, lng:83.2185 },
  { uid:'u7', displayName:'Suresh Babu', bloodGroup:'B-', age:27, gender:'Male', city:'Salem', address:'Hasthampatti, Salem', phone:'+91-9876543216', availability:true, verified:true, lastDonation:'2026-07-18', lat:11.6643, lng:78.1460 },
  { uid:'u8', displayName:'Lakshmi Narayana', bloodGroup:'O+', age:35, gender:'Male', city:'Guntur', address:'Arundelpet, Guntur', phone:'+91-9876543217', availability:true, verified:true, lastDonation:'2026-03-25', lat:16.3067, lng:80.4365 },
  { uid:'u9', displayName:'Kavitha Reddy', bloodGroup:'A+', age:26, gender:'Female', city:'Nellore', address:'Trunk Road, Nellore', phone:'+91-9876543218', availability:true, verified:true, lastDonation:'2026-05-18', lat:14.4426, lng:79.9865 },
  { uid:'u10', displayName:'Mohan Kumar', bloodGroup:'AB-', age:31, gender:'Male', city:'Trichy', address:'Thillai Nagar, Trichy', phone:'+91-9876543219', availability:true, verified:true, lastDonation:'2026-07-02', lat:10.7905, lng:78.7047 },
  { uid:'u11', displayName:'Ravi Shankar', bloodGroup:'B+', age:33, gender:'Male', city:'Vellore', address:'CMC Road, Vellore', phone:'+91-9876543220', availability:true, verified:true, lastDonation:'2026-06-15', lat:12.9165, lng:79.1325 }
];

export const HospitalsList = [
  { id:'h1', name:'Rajiv Gandhi Govt General Hospital (RGGGH)', city:'Chennai', address:'Park Town, Chennai', contact:'+91-44-25305000', bloodAvailability:{ 'O+':35, 'A+':22, 'B+':26, 'AB+':10, 'O-':14, 'A-':8, 'B-':7, 'AB-':4 } },
  { id:'h2', name:'Apollo Main Hospital, Greams Road', city:'Chennai', address:'Off Greams Road, Chennai', contact:'+91-44-28293333', bloodAvailability:{ 'O+':25, 'A+':18, 'B+':20, 'AB+':8, 'O-':10, 'A-':5, 'B-':6, 'AB-':3 } },
  { id:'h3', name:'Christian Medical College (CMC)', city:'Vellore', address:'Ida Scudder Road, Vellore', contact:'+91-416-2281000', bloodAvailability:{ 'O+':30, 'A+':20, 'B+':18, 'AB+':8, 'O-':12, 'A-':7, 'B-':6, 'AB-':4 } },
  { id:'h4', name:'JIPMER Super Speciality Hospital', city:'Puducherry', address:'Dhanvantari Nagar, Puducherry', contact:'+91-413-2272380', bloodAvailability:{ 'O+':34, 'A+':22, 'B+':24, 'AB+':9, 'O-':13, 'A-':7, 'B-':7, 'AB-':4 } },
  { id:'h5', name:'Govt Rajaji Medical College & Hospital', city:'Madurai', address:'Panagal Road, Madurai', contact:'+91-452-2532535', bloodAvailability:{ 'O+':24, 'A+':16, 'B+':18, 'AB+':6, 'O-':9, 'A-':5, 'B-':5, 'AB-':2 } },
  { id:'h6', name:'PSG Hospitals', city:'Coimbatore', address:'Avinashi Road, Coimbatore', contact:'+91-422-2570170', bloodAvailability:{ 'O+':20, 'A+':14, 'B+':16, 'AB+':6, 'O-':8, 'A-':4, 'B-':5, 'AB-':2 } },
  { id:'h7', name:'SVIMS Multi-Speciality Hospital', city:'Tirupati', address:'Alipiri Road, Tirupati', contact:'+91-877-2287777', bloodAvailability:{ 'O+':28, 'A+':19, 'B+':18, 'AB+':8, 'O-':11, 'A-':6, 'B-':6, 'AB-':3 } },
  { id:'h8', name:'King George Hospital (KGH)', city:'Visakhapatnam', address:'Maharanipeta, Visakhapatnam', contact:'+91-891-2564891', bloodAvailability:{ 'O+':32, 'A+':21, 'B+':20, 'AB+':9, 'O-':12, 'A-':7, 'B-':7, 'AB-':4 } },
  { id:'h9', name:'Govt General Hospital, Vijayawada', city:'Vijayawada', address:'Gunadala, Vijayawada', contact:'+91-866-2420385', bloodAvailability:{ 'O+':29, 'A+':18, 'B+':17, 'AB+':7, 'O-':10, 'A-':5, 'B-':5, 'AB-':3 } },
  { id:'h10', name:'NRI General & Super Speciality Hospital', city:'Guntur', address:'Mangalagiri, Guntur', contact:'+91-863-2878999', bloodAvailability:{ 'O+':22, 'A+':15, 'B+':16, 'AB+':6, 'O-':8, 'A-':4, 'B-':5, 'AB-':2 } },
  { id:'h11', name:'KIMS Super Speciality Hospital', city:'Nellore', address:'Dargamitta, Nellore', contact:'+91-861-6677777', bloodAvailability:{ 'O+':21, 'A+':14, 'B+':16, 'AB+':6, 'O-':8, 'A-':4, 'B-':5, 'AB-':2 } },
  { id:'h12', name:'RIMS Super Speciality Hospital', city:'Kadapa', address:'Putlampalli, Kadapa', contact:'+91-8562-252275', bloodAvailability:{ 'O+':19, 'A+':12, 'B+':14, 'AB+':4, 'O-':7, 'A-':3, 'B-':4, 'AB-':2 } },
  { id:'h13', name:'Area Government Hospital, Rly Kodur', city:'Rly Kodur', address:'Hospital Road, Railway Kodur', contact:'+91-8566-244222', bloodAvailability:{ 'O+':14, 'A+':9, 'B+':10, 'AB+':3, 'O-':5, 'A-':2, 'B-':3, 'AB-':1 } }
];

export const BloodBanksList = [
  { id:'bb1', name:'Tamil Nadu State Apex Blood Bank', city:'Chennai', address:'Kilpauk Medical College, Chennai', contact:'+91-44-26432804', stocks:{ 'O+':58, 'A+':40, 'B+':46, 'AB+':16, 'O-':22, 'A-':12, 'B-':14, 'AB-':6 } },
  { id:'bb2', name:'Indian Red Cross Society Blood Centre', city:'Chennai', address:'Anna Salai, Chennai', contact:'+91-44-28520068', stocks:{ 'O+':48, 'A+':32, 'B+':38, 'AB+':12, 'O-':18, 'A-':10, 'B-':12, 'AB-':5 } },
  { id:'bb3', name:'Rotary Central Blood Bank', city:'Coimbatore', address:'RS Puram, Coimbatore', contact:'+91-422-2543444', stocks:{ 'O+':42, 'A+':28, 'B+':34, 'AB+':11, 'O-':15, 'A-':8, 'B-':10, 'AB-':4 } },
  { id:'bb4', name:'SVIMS Regional Blood Centre', city:'Tirupati', address:'Alipiri Road, Tirupati', contact:'+91-877-2287777', stocks:{ 'O+':46, 'A+':30, 'B+':36, 'AB+':12, 'O-':16, 'A-':9, 'B-':11, 'AB-':4 } },
  { id:'bb5', name:'Indian Red Cross Society Blood Centre', city:'Vijayawada', address:'Governorpet, Vijayawada', contact:'+91-866-2573456', stocks:{ 'O+':50, 'A+':32, 'B+':38, 'AB+':13, 'O-':17, 'A-':10, 'B-':11, 'AB-':5 } },
  { id:'bb6', name:'King George Hospital (KGH) Blood Centre', city:'Visakhapatnam', address:'Maharanipeta, Vizag', contact:'+91-891-2564900', stocks:{ 'O+':52, 'A+':36, 'B+':42, 'AB+':15, 'O-':19, 'A-':11, 'B-':13, 'AB-':5 } },
  { id:'bb7', name:'RIMS Regional Blood Bank', city:'Kadapa', address:'Putlampalli, Kadapa', contact:'+91-8562-252280', stocks:{ 'O+':24, 'A+':15, 'B+':18, 'AB+':5, 'O-':8, 'A-':4, 'B-':4, 'AB-':2 } },
  { id:'bb8', name:'Red Cross Society Blood Centre', city:'Nellore', address:'Trunk Road, Nellore', contact:'+91-861-2326500', stocks:{ 'O+':30, 'A+':20, 'B+':24, 'AB+':8, 'O-':10, 'A-':6, 'B-':7, 'AB-':3 } }
];
