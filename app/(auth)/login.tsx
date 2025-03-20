"use client"

import { useState } from "react"
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
} from "react-native"
import axios from "axios"
import { router } from "expo-router"
import { StatusBar } from "expo-status-bar"

const { width, height } = Dimensions.get("window")

export default function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert("Error", "Please enter both username and password")
            return
        }

        setIsLoading(true)
        try {
            const res = await axios.post("http://10.0.2.2:8083/login", { username, password })
            Alert.alert("Success", "Login Successful")
            router.push("/")
        } catch (err) {
            console.error(err)
            Alert.alert("Error", "Login Failed. Please check your credentials.")
        } finally {
            setIsLoading(false)
        }
    }

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
                                    <Text style={styles.welcomeText}>Welcome</Text>
                                    <Text style={styles.tagline}>Sign in to continue the journey</Text>
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

                                    <TouchableOpacity style={styles.forgotPassword}>
                                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
                                        {isLoading ? (
                                            <ActivityIndicator color="#FFFFFF" />
                                        ) : (
                                            <Text style={styles.loginButtonText}>SIGN IN</Text>
                                        )}
                                    </TouchableOpacity>

                                </View>

                                <View style={styles.registerContainer}>
                                    <Text style={styles.registerText}>Don't have an account? </Text>
                                    <TouchableOpacity onPress={() => router.push("/register")}>
                                        <Text style={styles.registerLink}>Sign Up</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ImageBackground>
    )
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
        marginBottom: 50,
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
    forgotPassword: {
        alignSelf: "flex-end",
        marginBottom: 30,
    },
    forgotPasswordText: {
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: "#FF6B6B",
        borderRadius: 30,
        height: 56,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 30,
        shadowColor: "#FF6B6B",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    loginButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
        letterSpacing: 1,
    },
    orContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    orLine: {
        flex: 1,
        height: 1,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
    },
    orText: {
        color: "rgba(255, 255, 255, 0.8)",
        paddingHorizontal: 10,
        fontSize: 14,
    },
    socialButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 40,
    },
    socialButton: {
        flex: 1,
        height: 45,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 5,
    },
    googleButton: {
        backgroundColor: "#DB4437",
    },
    facebookButton: {
        backgroundColor: "#4267B2",
    },
    socialButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    registerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    registerText: {
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: 14,
    },
    registerLink: {
        color: "#FF6B6B",
        fontSize: 14,
        fontWeight: "bold",
    },
})

