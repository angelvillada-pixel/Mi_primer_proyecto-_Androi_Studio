package com.example.stylehub

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.NavType
import androidx.navigation.compose.*
import androidx.navigation.navArgument
import com.example.stylehub.ui.screens.*
import com.example.stylehub.ui.theme.StyleHubTheme
import com.example.stylehub.ui.viewmodel.ProductViewModel

class MainActivity : ComponentActivity() {

    private val viewModel: ProductViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            StyleHubTheme {
                val navController = rememberNavController()
                val authState by viewModel.authState.collectAsState()
                val cartState by viewModel.cartState.collectAsState()
                val currentBackStack by navController.currentBackStackEntryAsState()
                val currentRoute = currentBackStack?.destination?.route

                // Mostrar Toast en pantalla cuando cambie el mensaje
                LaunchedEffect(authState.toastMessage) {
                    authState.toastMessage?.let {
                        Toast.makeText(this@MainActivity, it, Toast.LENGTH_SHORT).show()
                        viewModel.setToast(null)
                    }
                }

                Scaffold(
                    bottomBar = {
                        NavigationBar {
                            NavigationBarItem(
                                selected = currentRoute == "home",
                                onClick = {
                                    // Volver al catálogo ya creado evita que el botón dependa
                                    // del estado del historial de navegación.
                                    if (!navController.popBackStack("home", inclusive = false)) {
                                        navController.navigate("home") { launchSingleTop = true }
                                    }
                                },
                                icon = { Icon(Icons.Default.Home, contentDescription = "Catálogo") },
                                label = { Text("Catálogo") }
                            )
                            NavigationBarItem(
                                selected = currentRoute == "cart",
                                onClick = {
                                    if (currentRoute != "cart") {
                                        navController.navigate("cart") { launchSingleTop = true }
                                    }
                                },
                                icon = {
                                    BadgedBox(badge = {
                                        if (cartState.totalItems > 0) Badge { Text(cartState.totalItems.toString()) }
                                    }) {
                                        Icon(Icons.Default.ShoppingCart, contentDescription = "Carrito")
                                    }
                                },
                                label = { Text("Carrito") }
                            )
                            NavigationBarItem(
                                selected = currentRoute == "profile",
                                onClick = {
                                    if (currentRoute != "profile") {
                                        navController.navigate("profile") { launchSingleTop = true }
                                    }
                                },
                                icon = { Icon(Icons.Default.AccountCircle, contentDescription = "Perfil") },
                                label = { Text(if (authState.isAuthenticated) authState.currentUser?.name?.firstname ?: "Perfil" else "Perfil") }
                            )
                        }
                    }
                ) { innerPadding ->
                    NavHost(
                        navController = navController,
                        startDestination = "home",
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(innerPadding)
                    ) {
                        composable("home") {
                            HomeScreen(
                                viewModel = viewModel,
                                onProductClick = { product ->
                                    navController.navigate("detail/${product.id}")
                                },
                                onCartClick = { navController.navigate("cart") }
                            )
                        }

                        composable("cart") {
                            CartScreen(
                                viewModel = viewModel,
                                onContinueShopping = {
                                    if (!navController.popBackStack("home", inclusive = false)) {
                                        navController.navigate("home") { launchSingleTop = true }
                                    }
                                }
                            )
                        }

                        composable(
                            route = "detail/{productId}",
                            arguments = listOf(navArgument("productId") { type = NavType.IntType })
                        ) { backStackEntry ->
                            val productId = backStackEntry.arguments?.getInt("productId") ?: 1
                            val catalogState by viewModel.catalogState.collectAsState()
                            val product = catalogState.products.find { it.id == productId }

                            product?.let {
                                ProductDetailScreen(
                                    product = it,
                                    viewModel = viewModel,
                                    onBackClick = { navController.popBackStack() }
                                )
                            }
                        }

                        composable("profile") {
                            UserProfileScreen(viewModel = viewModel)
                        }
                    }

                    // Modal de Login E-commerce
                    if (authState.isAuthModalOpen) {
                        AuthBottomSheet(
                            viewModel = viewModel,
                            onDismiss = { viewModel.setAuthModalOpen(false) }
                        )
                    }
                }
            }
        }
    }
}
