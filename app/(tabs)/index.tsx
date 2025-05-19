// app/(tabs)/index.tsx
import { Entypo } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import React, { JSX, useEffect, useRef, useState } from 'react';
import {
  Button,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// app/(tabs)/index.tsx
import '@tensorflow/tfjs-react-native'; // side-effects: registers the native binding
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import { db, storage } from '../../FirebaseConfig';



export default function Index(): JSX.Element {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);

  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [capturedUri, setCapturedUri] = useState<string | null>(null);

  
  const [term, setTerm]             = useState<string>('');
  const [definition, setDefinition] = useState<string>('');


  const saveFlashcard = async (): Promise<void> => {
    if (!capturedUri) return;
    try {
      // download file into a blob
      const resp = await fetch(capturedUri);
      const blob = await resp.blob();

      // upload to Storage
      const path = `flashcards/${Date.now()}.jpg`;
      console.log("storage:", storage);

      const ref  = storageRef(storage, path);
      await uploadBytes(ref, blob, { contentType: 'image/jpeg' })
        .catch((err) => {
          console.error('Upload Error Code:', err.code);
          console.error('Upload Error Message:', err.message);
          console.error('Server Response:', (err as any).serverResponse);
          throw err; // dışarı atsın ki outer catch yakalasın
       });

      // get its URL
      const url = await getDownloadURL(ref);

      // write a Firestore document
      await addDoc(collection(db, 'flashcards'), {
        imageUrl:   url,
        term,       // you can bind these to TextInputs later
        definition, //
        createdAt:  serverTimestamp(),
      });

      // reset & close
      setCapturedUri(null);
      setTerm('');
      setDefinition('');
      setModalVisible(false);
      alert('Flashcard saved!');
    } catch (e) {
      console.error(e);
      alert('Error saving card');
    }
  };




  const screenWidth = Dimensions.get('window').width;
  const squareSize = screenWidth * 0.9;

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const toggleCameraFacing = (): void => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  const grabPicture = async (): Promise<void> => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ skipProcessing: true });
      setCapturedUri(photo.uri);
      setModalVisible(true);
    }
  };

  if (permission) {
  ;
  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.infoText}>Grant camera permission to continue</Text>
        <Button title="Grant" onPress={requestPermission} />
      </View>
    );
  }}

  return (
    <View style={styles.container}>
      {/* Camera Preview with Overlay Buttons */}
      <View style={[styles.previewContainer, { width: squareSize, height: squareSize }]}>  
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing={facing}
        />
        <TouchableOpacity onPress={grabPicture} style={styles.captureButtonOverlay}>
          <Entypo name="camera" size={32} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleCameraFacing} style={styles.flipButtonOverlay}>
          <Entypo name="cycle" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Modal Popup Centered */}
      <Modal
        transparent
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {capturedUri && <Image source={{ uri: capturedUri }} style={styles.snapped} />}
            <Text style={styles.title}>Translated word</Text>
            <Text style={styles.subtitle}>Base Language word</Text>
            <View style={styles.modalButtons}>
              <Button title="Cancel" color="#DC2626" onPress={() => setModalVisible(false)} />
              <Button title="Save" onPress={saveFlashcard}/>

            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    marginBottom: 12,
    fontSize: 16,
    color: '#555',
  },
  previewContainer: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#CCC',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  captureButtonOverlay: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 32,
  },
  flipButtonOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  snapped: {
    width: '100%',
    height: 200,
    marginBottom: 12,
    borderRadius: 6,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});