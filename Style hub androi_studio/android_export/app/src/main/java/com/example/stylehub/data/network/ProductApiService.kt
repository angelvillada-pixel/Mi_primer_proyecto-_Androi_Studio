package com.example.stylehub.data.network

import com.example.stylehub.data.model.Cart
import com.example.stylehub.data.model.Product
import com.example.stylehub.data.model.User
import com.example.stylehub.data.model.LoginRequest
import com.example.stylehub.data.model.LoginResponse
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Body
import retrofit2.http.POST
import java.util.concurrent.TimeUnit

/**
 * 2. Interfaz de Retrofit para consumir la Fake Store API
 */
interface ProductApiService {

    @GET("products")
    suspend fun getProducts(): List<Product>

    @GET("products/{id}")
    suspend fun getProductById(@Path("id") id: Int): Product

    @GET("products/categories")
    suspend fun getCategories(): List<String>

    @GET("products/category/{category}")
    suspend fun getProductsByCategory(@Path("category") category: String): List<Product>

    @GET("users")
    suspend fun getUsers(): List<User>

    @GET("users/{id}")
    suspend fun getUserById(@Path("id") id: Int): User

    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): LoginResponse

    @GET("carts/user/{userId}")
    suspend fun getUserCarts(@Path("userId") userId: Int): List<Cart>
}

/**
 * Singleton de Retrofit con timeout y logging
 */
object RetrofitClient {
    private const val BASE_URL = "https://fakestoreapi.com/"

    private val logging = HttpLoggingInterceptor().apply {
        // Request bodies can contain credentials; do not expose them in release logs.
        level = HttpLoggingInterceptor.Level.NONE
    }

    private val client = OkHttpClient.Builder()
        .addInterceptor(logging)
        .connectTimeout(4, TimeUnit.SECONDS)
        .readTimeout(4, TimeUnit.SECONDS)
        .callTimeout(6, TimeUnit.SECONDS)
        .build()

    val apiService: ProductApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ProductApiService::class.java)
    }
}
