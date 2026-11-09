package com.example.stylehub.data.model

import com.google.gson.annotations.SerializedName

/**
 * 1. Data Classes que mapean la Fake Store API (https://fakestoreapi.com)
 */

data class Rating(
    val rate: Double,
    val count: Int
)

data class Product(
    val id: Int,
    val title: String,
    val price: Double,
    val description: String,
    val category: String,
    val image: String,
    val rating: Rating? = Rating(4.5, 100)
)

data class UserName(
    val firstname: String,
    val lastname: String
)

data class Geolocation(
    val lat: String,
    val long: String
)

data class UserAddress(
    val city: String,
    val street: String,
    val number: Int,
    val zipcode: String,
    val geolocation: Geolocation? = null
)

data class User(
    val id: Int,
    val email: String,
    val username: String,
    val name: UserName,
    val address: UserAddress,
    val phone: String
)

data class CartItem(
    val productId: Int,
    val quantity: Int
)

data class Cart(
    val id: Int,
    val userId: Int,
    val date: String,
    val products: List<CartItem>
)

data class LoginRequest(
    val username: String,
    val password: String
)

data class LoginResponse(
    val token: String
)

/**
 * Modelo de UI reactivo para el Carrito en la aplicación
 */
data class CartItemUi(
    val product: Product,
    val quantity: Int
) {
    val subtotal: Double
        get() = product.price * quantity
}
