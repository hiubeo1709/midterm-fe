import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    Keyboard,
    TouchableWithoutFeedback,
} from "react-native";
import axios from "axios";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

const { width, height } = Dimensions.get("window");

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        // Basic validation
        if (!username || !password) {
            Alert.alert("Error", "Please fill in all required fields");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            await axios.post("http://10.0.2.2:8083/register", { username, password });
            Alert.alert("Success", "Registration Successful");
            router.push("/login");
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Registration Failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ImageBackground
            source={{ uri: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1000" }}
            style={styles.backgroundImage}
        >
            <StatusBar style="light" />
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={styles.keyboardAvoidingView}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                            bounces={false}
                        >
                            <View style={styles.overlay}>
                                <View style={styles.headerContainer}>
                                    <Text style={styles.welcomeText}>Create Account</Text>
                                    <Text style={styles.tagline}>Join our community today</Text>
                                </View>

                                <View style={styles.formContainer}>
                                    <View style={styles.inputWrapper}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Username"
                                            placeholderTextColor="rgba(255,255,255,0.7)"
                                            value={username}
                                            onChangeText={setUsername}
                                            autoCapitalize="none"
                                        />
                                    </View>

                                    <View style={styles.inputWrapper}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Password"
                                            placeholderTextColor="rgba(255,255,255,0.7)"
                                            secureTextEntry
                                            value={password}
                                            onChangeText={setPassword}
                                        />
                                    </View>

                                    <View style={styles.inputWrapper}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Confirm Password"
                                            placeholderTextColor="rgba(255,255,255,0.7)"
                                            secureTextEntry
                                            value={confirmPassword}
                                            onChangeText={setConfirmPassword}
                                        />
                                    </View>

                                    <TouchableOpacity
                                        style={styles.registerButton}
                                        onPress={handleRegister}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <ActivityIndicator color="#FFFFFF" />
                                        ) : (
                                            <Text style={styles.registerButtonText}>CREATE ACCOUNT</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.loginContainer}>
                                    <Text style={styles.loginText}>Already have an account? </Text>
                                    <TouchableOpacity onPress={() => router.push("/login")}>
                                        <Text style={styles.loginLink}>Sign In</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    container: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        padding: 20,
        justifyContent: "center",
        minHeight: height,
    },
    headerContainer: {
        marginBottom: 40,
        alignItems: "center",
    },
    welcomeText: {
        fontSize: 42,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 10,
        textAlign: "center",
    },
    tagline: {
        fontSize: 16,
        color: "rgba(255, 255, 255, 0.8)",
        textAlign: "center",
    },
    formContainer: {
        width: "100%",
        maxWidth: 350,
        alignSelf: "center",
    },
    inputWrapper: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.3)",
    },
    input: {
        height: 50,
        color: "#FFFFFF",
        fontSize: 16,
        paddingHorizontal: 5,
    },
    registerButton: {
        backgroundColor: "#FF6B6B",
        borderRadius: 30,
        height: 56,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 20,
        shadowColor: "#FF6B6B",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    registerButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
        letterSpacing: 1,
    },
    termsContainer: {
        marginBottom: 30,
    },
    termsText: {
        color: "rgba(255, 255, 255, 0.7)",
        fontSize: 12,
        textAlign: "center",
        lineHeight: 18,
    },
    termsLink: {
        color: "#FF6B6B",
        fontWeight: "bold",
    },
    loginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },
    loginText: {
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: 14,
    },
    loginLink: {
        color: "#FF6B6B",
        fontSize: 14,
        fontWeight: "bold",
    },
});
