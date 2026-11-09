package com.example.stylehub.data.repository

import com.example.stylehub.data.model.*
import com.example.stylehub.data.network.ProductApiService
import com.example.stylehub.data.network.RetrofitClient
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * 2. Repositorio MVVM con manejo de Fallback offline y caché
 */
class ProductRepository(
    private val api: ProductApiService = RetrofitClient.apiService
) {
    private var cachedProducts: List<Product>? = null
    private var cachedCategories: List<String>? = null

    // Fallback seed data in case emulator is offline or API fails
    private val fallbackProducts = listOf(
        Product(
            id = 1,
            title = "Fjallraven - Foldsack No. 1 Backpack",
            price = 109.95,
            description = "Your perfect pack for everyday use and walks in the forest. Stash your laptop in the padded sleeve.",
            category = "men's clothing",
            image = "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
            rating = Rating(3.9, 120)
        ),
        Product(
            id = 2,
            title = "Mens Casual Premium Slim Fit T-Shirts",
            price = 22.3,
            description = "Slim-fitting style, contrast raglan long sleeve, three-button henley placket.",
            category = "men's clothing",
            image = "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UT_.jpg",
            rating = Rating(4.1, 259)
        ),
        Product(
            id = 5,
            title = "John Hardy Women's Naga Dragon Bracelet",
            price = 695.0,
            description = "From our Legends Collection, inspired by the mythical water dragon that protects the ocean pearl.",
            category = "jewelery",
            image = "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
            rating = Rating(4.6, 400)
        ),
        Product(
            id = 9,
            title = "WD 2TB Elements External Hard Drive",
            price = 64.0,
            description = "Fast data transfers, Improve PC Performance High Capacity USB 3.0.",
            category = "electronics",
            image = "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
            rating = Rating(3.3, 203)
        ),
        Product(
            id = 15,
            title = "BIYLACLESEN Women's 3-in-1 Snowboard Jacket",
            price = 56.99,
            description = "Detachable Liner Fabric: Warm Fleece. Detachable Adjustable Hood and Adjustable cuffs with Velcro.",
            category = "women's clothing",
            image = "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
            rating = Rating(2.6, 235)
        )
    )

    private val fallbackUsers = listOf(
        User(
            id = 1,
            email = "john@gmail.com",
            username = "johnd",
            name = UserName("John", "Doe"),
            address = UserAddress("Kilcoole", "7835 New Road", 3, "12926"),
            phone = "1-570-562-3019"
        ),
        User(
            id = 2,
            email = "david@gmail.com",
            username = "david_r",
            name = UserName("David", "Morrison"),
            address = UserAddress("Cullman", "8680 Walnut Street", 8, "35055"),
            phone = "1-256-737-1289"
        )
    )

    fun immediateProducts(): List<Product> = cachedProducts ?: fallbackProducts

    fun immediateCategories(): List<String> = cachedCategories
        ?: listOf("men's clothing", "women's clothing", "jewelery", "electronics")

    suspend fun getProducts(): Result<List<Product>> = withContext(Dispatchers.IO) {
        try {
            val response = api.getProducts()
            val products = if (response.isNotEmpty()) response else fallbackProducts
            cachedProducts = products
            Result.success(products)
        } catch (e: Exception) {
            Result.success(fallbackProducts) // Fail-safe fallback
        }
    }

    suspend fun getProductById(id: Int): Result<Product> = withContext(Dispatchers.IO) {
        try {
            val product = api.getProductById(id)
            Result.success(product)
        } catch (e: Exception) {
            val fallback = fallbackProducts.find { it.id == id } ?: fallbackProducts.first()
            Result.success(fallback)
        }
    }

    suspend fun getCategories(): Result<List<String>> = withContext(Dispatchers.IO) {
        try {
            val categories = api.getCategories()
            val result = categories.ifEmpty { immediateCategories() }
            cachedCategories = result
            Result.success(result)
        } catch (e: Exception) {
            Result.success(listOf("men's clothing", "women's clothing", "jewelery", "electronics"))
        }
    }

    suspend fun getUsers(): Result<List<User>> = withContext(Dispatchers.IO) {
        try {
            val users = api.getUsers()
            Result.success(if (users.isNotEmpty()) users else fallbackUsers)
        } catch (e: Exception) {
            Result.success(fallbackUsers)
        }
    }

    suspend fun authenticate(username: String, password: String): Result<Unit> = withContext(Dispatchers.IO) {
        try {
            val token = api.login(LoginRequest(username, password)).token
            if (token.isBlank()) Result.failure(IllegalStateException("Token vacío")) else Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getUserCarts(userId: Int): Result<List<Cart>> = withContext(Dispatchers.IO) {
        try {
            val carts = api.getUserCarts(userId)
            if (carts.isNotEmpty()) {
                Result.success(carts)
            } else {
                Result.success(getFallbackCarts(userId))
            }
        } catch (e: Exception) {
            Result.success(getFallbackCarts(userId))
        }
    }

    private fun getFallbackCarts(userId: Int): List<Cart> = listOf(
        Cart(
            id = 100 + userId,
            userId = userId,
            date = "2026-10-25",
            products = listOf(
                CartItem(productId = 1, quantity = 1),
                CartItem(productId = 2, quantity = 2)
            )
        )
    )
}
