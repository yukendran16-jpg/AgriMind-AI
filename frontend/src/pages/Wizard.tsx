import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sprout, User as UserIcon, MapPin, CheckCircle2, ChevronRight, ChevronLeft,
  Bell, Shield, Award, Sparkles, Navigation, Globe
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export default function Wizard() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Basic Info
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '+91 9876543210');
  const [language, setLanguage] = useState(user?.language || 'en');

  // Step 2: Farm Registration
  const [farmName, setFarmName] = useState(user?.farmName || 'Green Field Organics');
  const [farmSize, setFarmSize] = useState<number>(user?.farmSizeAcres || 15);
  const [address, setAddress] = useState(user?.address || 'NH 48 Agro Belt');
  const [state, setState] = useState(user?.state || 'Gujarat');
  const [district, setDistrict] = useState(user?.district || 'Anand');
  const [village, setVillage] = useState(user?.village || 'Vasna');

  // Step 3: Crop Selection
  const availableCrops = [
    'Tomato', 'Cotton', 'Wheat', 'Rice', 'Sugarcane',
    'Maize', 'Potato', 'Chili', 'Soybean', 'Mustard', 'Groundnut', 'Onion'
  ];
  const [selectedCrops, setSelectedCrops] = useState<string[]>(user?.cropTypes || ['Tomato', 'Cotton', 'Wheat']);

  // Step 4: Location
  const [latitude, setLatitude] = useState<number>(user?.latitude || 22.5726);
  const [longitude, setLongitude] = useState<number>(user?.longitude || 72.9289);
  const [locating, setLocating] = useState(false);

  // Step 5: Notification Preferences
  const [notifs, setNotifs] = useState({
    emailAlerts: true,
    smsAlerts: true,
    pestWarnings: true,
    weatherUpdates: true,
    marketPrices: true
  });

  const toggleCrop = (crop: string) => {
    if (selectedCrops.includes(crop)) {
      setSelectedCrops(selectedCrops.filter(c => c !== crop));
    } else {
      setSelectedCrops([...selectedCrops, crop]);
    }
  };

  const handleGetLocation = () => {
    setLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(parseFloat(pos.coords.latitude.toFixed(6)));
          setLongitude(parseFloat(pos.coords.longitude.toFixed(6)));
          setLocating(false);
        },
        () => {
          setLatitude(22.5726);
          setLongitude(72.9289);
          setLocating(false);
        }
      );
    } else {
      setLocating(false);
    }
  };

  const handleFinishWizard = async () => {
    setLoading(true);
    const wizardPayload = {
      step1: { full_name: fullName, phone_number: phoneNumber, language },
      step2: { farm_name: farmName, farm_size_acres: Number(farmSize), address, state, district, village },
      step3: { crop_types: selectedCrops },
      step4: { latitude: Number(latitude), longitude: Number(longitude) },
      step5: notifs
    };

    try {
      await axios.post(`${API_BASE_URL}/api/v1/auth/wizard/complete`, wizardPayload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('agrimind_token')}` }
      });
    } catch (err) {
      console.warn("Backend offline, updating local profile...");
    }

    updateUser({
      fullName,
      phoneNumber,
      language,
      farmName,
      farmSizeAcres: Number(farmSize),
      address,
      state,
      district,
      village,
      cropTypes: selectedCrops,
      latitude: Number(latitude),
      longitude: Number(longitude),
      notificationPreferences: notifs,
      isWizardCompleted: true
    });

    setLoading(false);
    navigate('/dashboard');
  };

  const stepTitles = [
    "1. Basic Info",
    "2. Farm Details",
    "3. Select Crops",
    "4. GPS Location",
    "5. Notifications",
    "6. Complete Profile"
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '32px 16px', background: 'radial-gradient(circle at top, #0d2116 0%, #050b08 100%)', color: '#fff' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        
        {/* Header Progress Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', background: 'linear-gradient(135deg, #2ecc71, #27ae60)', padding: '10px', borderRadius: '12px', marginBottom: '8px' }}>
            <Sprout size={28} color="#05140a" />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>First-Time Setup Wizard</h1>
          <p style={{ color: '#95a5a6', fontSize: '0.9rem' }}>Configure your farm profile to initialize AgriMind AI intelligence models</p>
        </div>

        {/* Step Progress Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '18px', left: '5%', right: '5%', height: '2px', background: '#1e3a29', zIndex: 0 }} />
          {stepTitles.map((title, idx) => {
            const stepNum = idx + 1;
            const isActive = stepNum === currentStep;
            const isDone = stepNum < currentStep;
            return (
              <div
                key={title}
                onClick={() => isDone && setCurrentStep(stepNum)}
                style={{ zIndex: 1, cursor: isDone ? 'pointer' : 'default', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: isActive ? '#2ecc71' : isDone ? '#27ae60' : '#121a16',
                  color: isActive || isDone ? '#05140a' : '#7f8c8d',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem',
                  border: isActive ? '3px solid #0d2116' : '2px solid #1e3a29',
                  boxShadow: isActive ? '0 0 15px rgba(46,204,113,0.5)' : 'none'
                }}>
                  {isDone ? <CheckCircle2 size={20} /> : stepNum}
                </div>
                <span style={{ fontSize: '0.75rem', marginTop: '6px', color: isActive ? '#2ecc71' : isDone ? '#ecf0f1' : '#7f8c8d', fontWeight: isActive ? 700 : 500 }}>
                  {title.split(' ')[1]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step Panel Container */}
        <div className="glass-panel" style={{ padding: '36px', borderRadius: '20px', border: '1px solid rgba(46, 204, 113, 0.2)', background: 'rgba(18, 26, 22, 0.95)' }}>
          
          {/* STEP 1: Basic Information */}
          {currentStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#2ecc71' }}>
                <UserIcon size={24} /> Step 1: Basic Information
              </h2>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#bdc3c7', marginBottom: '6px', fontWeight: 600 }}>Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: '#09150d', border: '1px solid #1e3a29', color: '#fff', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#bdc3c7', marginBottom: '6px', fontWeight: 600 }}>Contact Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: '#09150d', border: '1px solid #1e3a29', color: '#fff', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#bdc3c7', marginBottom: '6px', fontWeight: 600 }}>Preferred Interface Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: '#09150d', border: '1px solid #1e3a29', color: '#fff', borderRadius: '8px' }}
                >
                  <option value="en">English (Global standard)</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="gu">Gujarati (ગુજરાતી)</option>
                  <option value="mr">Marathi (मराठी)</option>
                  <option value="ta">Tamil (தமிழ்)</option>
                  <option value="te">Telugu (తెలుగు)</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: Farm Registration */}
          {currentStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#2ecc71' }}>
                <Sprout size={24} /> Step 2: Farm Profile & Land Size
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#bdc3c7', marginBottom: '6px', fontWeight: 600 }}>Farm Name</label>
                  <input
                    type="text"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    style={{ width: '100%', padding: '12px', background: '#09150d', border: '1px solid #1e3a29', color: '#fff', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#bdc3c7', marginBottom: '6px', fontWeight: 600 }}>Size (Acres)</label>
                  <input
                    type="number"
                    value={farmSize}
                    onChange={(e) => setFarmSize(parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', padding: '12px', background: '#09150d', border: '1px solid #1e3a29', color: '#fff', borderRadius: '8px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#bdc3c7', marginBottom: '6px', fontWeight: 600 }}>Street Address / Landmark</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: '#09150d', border: '1px solid #1e3a29', color: '#fff', borderRadius: '8px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#bdc3c7', marginBottom: '6px', fontWeight: 600 }}>State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    style={{ width: '100%', padding: '12px', background: '#09150d', border: '1px solid #1e3a29', color: '#fff', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#bdc3c7', marginBottom: '6px', fontWeight: 600 }}>District</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    style={{ width: '100%', padding: '12px', background: '#09150d', border: '1px solid #1e3a29', color: '#fff', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#bdc3c7', marginBottom: '6px', fontWeight: 600 }}>Village</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    style={{ width: '100%', padding: '12px', background: '#09150d', border: '1px solid #1e3a29', color: '#fff', borderRadius: '8px' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Crop Selection */}
          {currentStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#2ecc71' }}>
                <Sparkles size={24} /> Step 3: Select Cultivated Crops
              </h2>
              <p style={{ color: '#95a5a6', fontSize: '0.85rem' }}>Select all major crops grown in your farm to enable specialized AI disease models.</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
                {availableCrops.map((crop) => {
                  const isSelected = selectedCrops.includes(crop);
                  return (
                    <div
                      key={crop}
                      onClick={() => toggleCrop(crop)}
                      style={{
                        padding: '14px 10px',
                        borderRadius: '12px',
                        textAlign: 'center',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        background: isSelected ? 'rgba(46, 204, 113, 0.2)' : '#09150d',
                        border: isSelected ? '2px solid #2ecc71' : '1px solid #1e3a29',
                        color: isSelected ? '#2ecc71' : '#bdc3c7',
                        transition: 'all 0.2s'
                      }}
                    >
                      {crop}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Location */}
          {currentStep === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#2ecc71' }}>
                <MapPin size={24} /> Step 4: Precise Geo-Location
              </h2>

              <p style={{ color: '#95a5a6', fontSize: '0.85rem' }}>AgriMind AI integrates micro-climate weather feeds and satellite indices based on GPS coordinates.</p>

              <button
                type="button"
                onClick={handleGetLocation}
                disabled={locating}
                style={{
                  padding: '14px', background: '#1e3a29', border: '1px solid #2ecc71', color: '#2ecc71',
                  borderRadius: '10px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                <Navigation size={18} /> {locating ? 'Detecting GPS Coordinates...' : 'Detect My Live Farm GPS Location'}
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#bdc3c7', marginBottom: '6px', fontWeight: 600 }}>Latitude (°N)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={latitude}
                    onChange={(e) => setLatitude(parseFloat(e.target.value))}
                    style={{ width: '100%', padding: '12px', background: '#09150d', border: '1px solid #1e3a29', color: '#fff', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#bdc3c7', marginBottom: '6px', fontWeight: 600 }}>Longitude (°E)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={longitude}
                    onChange={(e) => setLongitude(parseFloat(e.target.value))}
                    style={{ width: '100%', padding: '12px', background: '#09150d', border: '1px solid #1e3a29', color: '#fff', borderRadius: '8px' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Notification Preferences */}
          {currentStep === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#2ecc71' }}>
                <Bell size={24} /> Step 5: Notification Preferences
              </h2>

              {[
                { key: 'emailAlerts', label: 'Email Advisory Digests & Weekly Reports' },
                { key: 'smsAlerts', label: 'Urgent SMS Weather & Pest Emergency Alerts' },
                { key: 'pestWarnings', label: 'Early Pest Outbreak Risk Warnings' },
                { key: 'weatherUpdates', label: 'Daily Micro-Climate Forecast Updates' },
                { key: 'marketPrices', label: 'Real-Time Mandi Market Price Insights' }
              ].map((item) => (
                <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#09150d', borderRadius: '8px', cursor: 'pointer', border: '1px solid #1e3a29' }}>
                  <input
                    type="checkbox"
                    checked={(notifs as any)[item.key]}
                    onChange={(e) => setNotifs({ ...notifs, [item.key]: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: '#2ecc71' }}
                  />
                  <span style={{ fontSize: '0.9rem', color: '#ecf0f1', fontWeight: 600 }}>{item.label}</span>
                </label>
              ))}
            </div>
          )}

          {/* STEP 6: Complete Profile */}
          {currentStep === 6 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#2ecc71' }}>
                <Award size={24} /> Step 6: Review & Finalize Profile
              </h2>

              <div style={{ background: '#09150d', padding: '20px', borderRadius: '12px', border: '1px solid #1e3a29', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#7f8c8d' }}>Owner Name:</span>
                  <span style={{ fontWeight: 700 }}>{fullName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#7f8c8d' }}>Farm Name & Size:</span>
                  <span style={{ fontWeight: 700 }}>{farmName} ({farmSize} Acres)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#7f8c8d' }}>Location:</span>
                  <span style={{ fontWeight: 700 }}>{village}, {district}, {state}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#7f8c8d' }}>Crops Configured:</span>
                  <span style={{ fontWeight: 700, color: '#2ecc71' }}>{selectedCrops.join(', ')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#7f8c8d' }}>GPS Coordinates:</span>
                  <span style={{ fontWeight: 700 }}>{latitude}° N, {longitude}° E</span>
                </div>
              </div>

              <div style={{ background: 'rgba(46, 204, 113, 0.1)', border: '1px solid #2ecc71', padding: '14px', borderRadius: '10px', color: '#2ecc71', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Shield size={22} /> Your profile configuration will generate AI models personalized to your land!
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', paddingTop: '20px', borderTop: '1px solid #1e3a29' }}>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                style={{ padding: '12px 20px', background: '#09150d', border: '1px solid #1e3a29', color: '#fff', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
              >
                <ChevronLeft size={18} /> Previous
              </button>
            ) : <div />}

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #2ecc71, #27ae60)', border: 'none', color: '#05140a', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
              >
                Next Step <ChevronRight size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishWizard}
                disabled={loading}
                style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #2ecc71, #27ae60)', border: 'none', color: '#05140a', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}
              >
                {loading ? 'Initializing Engine...' : 'Complete Setup & Launch Dashboard'} <CheckCircle2 size={18} />
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
