package com.example.moduloventa.view.layout

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ModalNavigationDrawer
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.rememberDrawerState
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.graphics.Color
import com.example.moduloventa.view.screens.AgregarPromoScreen
import kotlinx.coroutines.launch

import com.example.moduloventa.view.components.AppDrawer
import com.example.moduloventa.view.navigation.DrawerOption
import com.example.moduloventa.view.screens.PromoScreem
import com.example.moduloventa.view.screens.PuntoVentaScreen


@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainLayout() {

    var currentOption by remember {
        mutableStateOf(DrawerOption.PUNTO_VENTA) // 👈 inicia en Punto de Venta
    }

    var showAgregarPromo by remember { mutableStateOf(false) }

    val drawerState = rememberDrawerState(DrawerValue.Closed)
    val scope = rememberCoroutineScope()

    ModalNavigationDrawer(
        drawerState = drawerState,
        drawerContent = {
            AppDrawer(
                onOptionSelected = { option ->
                    currentOption = option
                    scope.launch { drawerState.close() }
                }
            )
        }
    ) {

        Scaffold(
            topBar = {
                TopAppBar(
                    title = {
                        Text(
                            text = when (currentOption) {
                                DrawerOption.PUNTO_VENTA -> "Punto de venta"
                                DrawerOption.PROMOS -> "Promociones"
                                DrawerOption.AGREGAR_PROMO -> "Agregar promoción"
                            },
                            color = Color(0xFF4AAAA5)
                        )
                    },
                    navigationIcon = {
                        IconButton(
                            onClick = {
                                scope.launch { drawerState.open() }
                            }
                        ) {
                            Icon(
                                imageVector = Icons.Default.Menu,
                                contentDescription = "Abrir menú",
                                tint = Color(0xFF4AAAA5)
                            )
                        }
                    }
                )
            }
        ) { paddingValues ->

            Box(modifier = Modifier.padding(paddingValues)) {

                when (currentOption) {

                    DrawerOption.PUNTO_VENTA -> {
                        PuntoVentaScreen()
                    }

                    DrawerOption.PROMOS -> {
                        PromoScreem(
                            onAddPromoClick = {
                                currentOption = DrawerOption.AGREGAR_PROMO
                            }
                        )
                    }

                    DrawerOption.AGREGAR_PROMO -> {
                        AgregarPromoScreen()
                    }
                }
//                when (currentOption) {
//                    DrawerOption.PUNTO_VENTA -> PuntoVentaScreen()
//                    DrawerOption.PROMOS -> PromoScreem()
//                }
            }
        }
    }
}

