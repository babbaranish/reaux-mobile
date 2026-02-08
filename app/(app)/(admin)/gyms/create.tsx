import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../../../src/components/layout/SafeScreen';
import { Header } from '../../../../src/components/layout/Header';
import { Input } from '../../../../src/components/ui/Input';
import { Button } from '../../../../src/components/ui/Button';
import { RoleGuard } from '../../../../src/components/guards/RoleGuard';
import { gymsApi } from '../../../../src/api/endpoints/gyms';
import { useImagePicker } from '../../../../src/hooks/useImagePicker';
import { colors, fontFamily, spacing, borderRadius, layout } from '../../../../src/theme';
import client from '../../../../src/api/client';

export default function CreateGymScreen() {
  const router = useRouter();
  const { pickImage } = useImagePicker();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [amenities, setAmenities] = useState('');
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [logoUri, setLogoUri] = useState<string | null>(null);

  const handlePickImage = async () => {
    const result = await pickImage();
    if (result) {
      setImageUris((prev) => [...prev, result.uri]);
    }
  };

  const removeImage = (index: number) => {
    setImageUris((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePickLogo = async () => {
    const result = await pickImage();
    if (result) {
      setLogoUri(result.uri);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Gym name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const hasMedia = imageUris.length > 0 || logoUri;

      if (hasMedia) {
        const form = new FormData();
        imageUris.forEach((uri, idx) => {
          form.append('images', {
            uri,
            type: 'image/jpeg',
            name: `gym_${idx}.jpg`,
          } as any);
        });
        if (logoUri) {
          form.append('logo', {
            uri: logoUri,
            type: 'image/jpeg',
            name: 'gym_logo.jpg',
          } as any);
        }
        form.append('name', name.trim());
        if (description.trim()) form.append('description', description.trim());
        if (phone.trim()) form.append('phone', phone.trim());
        if (email.trim()) form.append('email', email.trim());
        if (street.trim()) form.append('address[street]', street.trim());
        if (city.trim()) form.append('address[city]', city.trim());
        if (state.trim()) form.append('address[state]', state.trim());
        if (pincode.trim()) form.append('address[pincode]', pincode.trim());
        const amenitiesList = amenities
          .split(',')
          .map((a) => a.trim())
          .filter(Boolean);
        amenitiesList.forEach((a) => form.append('amenities[]', a));

        await client.post('/gyms', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 60_000,
        });
      } else {
        await gymsApi.create({
          name: name.trim(),
          description: description.trim() || undefined,
          phone: phone.trim() || undefined,
          email: email.trim() || undefined,
          address: {
            street: street.trim() || undefined,
            city: city.trim() || undefined,
            state: state.trim() || undefined,
            pincode: pincode.trim() || undefined,
          },
          amenities: amenities
            .split(',')
            .map((a) => a.trim())
            .filter(Boolean),
        });
      }

      Alert.alert('Success', 'Gym created successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to create gym');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RoleGuard allowedRoles={['superadmin']}>
      <SafeScreen>
        <Header title="Create Gym" showBack onBack={() => router.back()} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Images */}
          <Text style={styles.sectionTitle}>Images</Text>
          <View style={styles.imagesRow}>
            {imageUris.map((uri, idx) => (
              <View key={idx} style={styles.imageContainer}>
                <Image
                  source={{ uri }}
                  style={styles.imagePreview}
                  contentFit="cover"
                  transition={200}
                />
                <TouchableOpacity
                  style={styles.removeImageBtn}
                  onPress={() => removeImage(idx)}
                >
                  <Ionicons name="close-circle" size={22} color={colors.text.white} />
                </TouchableOpacity>
              </View>
            ))}
            {imageUris.length < 5 && (
              <TouchableOpacity
                style={styles.addImageBtn}
                onPress={handlePickImage}
                activeOpacity={0.7}
              >
                <Ionicons name="camera-outline" size={28} color={colors.text.light} />
                <Text style={styles.addImageText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Logo */}
          <Text style={styles.sectionTitle}>Logo</Text>
          <View style={styles.imagesRow}>
            {logoUri ? (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: logoUri }}
                  style={styles.imagePreview}
                  contentFit="cover"
                  transition={200}
                />
                <TouchableOpacity
                  style={styles.removeImageBtn}
                  onPress={() => setLogoUri(null)}
                >
                  <Ionicons name="close-circle" size={22} color={colors.text.white} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addImageBtn}
                onPress={handlePickLogo}
                activeOpacity={0.7}
              >
                <Ionicons name="image-outline" size={28} color={colors.text.light} />
                <Text style={styles.addImageText}>Logo</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Basic Info */}
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.field}>
            <Input
              label="Gym Name *"
              placeholder="e.g. FitHub Mumbai"
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.field}>
            <Input
              label="Description"
              placeholder="Describe the gym..."
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>

          {/* Contact */}
          <Text style={styles.sectionTitle}>Contact</Text>
          <View style={styles.field}>
            <Input
              label="Phone"
              placeholder="+91 9876543210"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.field}>
            <Input
              label="Email"
              placeholder="gym@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>

          {/* Address */}
          <Text style={styles.sectionTitle}>Address</Text>
          <View style={styles.field}>
            <Input
              label="Street"
              placeholder="123 Main Street"
              value={street}
              onChangeText={setStreet}
            />
          </View>
          <View style={styles.row}>
            <View style={styles.halfField}>
              <Input
                label="City"
                placeholder="Mumbai"
                value={city}
                onChangeText={setCity}
              />
            </View>
            <View style={styles.halfField}>
              <Input
                label="State"
                placeholder="Maharashtra"
                value={state}
                onChangeText={setState}
              />
            </View>
          </View>
          <View style={styles.field}>
            <Input
              label="Pincode"
              placeholder="400001"
              value={pincode}
              onChangeText={setPincode}
              keyboardType="numeric"
            />
          </View>

          {/* Amenities */}
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.field}>
            <Input
              label="Amenities (comma separated)"
              placeholder="WiFi, AC, Shower, Parking"
              value={amenities}
              onChangeText={setAmenities}
            />
          </View>

          {/* Submit */}
          <View style={styles.submitContainer}>
            <Button
              title="Create Gym"
              onPress={handleSubmit}
              variant="primary"
              size="lg"
              fullWidth
              loading={isSubmitting}
            />
          </View>
        </ScrollView>
      </SafeScreen>
    </RoleGuard>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text.primary,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  field: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  halfField: {
    flex: 1,
  },
  imagesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  imageContainer: {
    position: 'relative',
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
  },
  removeImageBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
  },
  addImageBtn: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border.gray,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  addImageText: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: colors.text.light,
  },
  submitContainer: {
    marginTop: spacing.xxl,
  },
});
