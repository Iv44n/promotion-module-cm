package com.example.moduloventa.view.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp

@Composable
fun AgregarPromoScreen() {

    val primary = Color(0xFF29A8A6)

    Box(
        modifier = Modifier.fillMaxSize()
    ) {

        // CONTENIDO SCROLLEABLE
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
                .padding(bottom = 120.dp), // espacio para botones
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {

            VigenciaCard(primary)
            TiendaCard(primary)
            DetalleDescuentoCard(primary)
        }

        // FOOTER FIJO
        PromoFooter(
            modifier = Modifier.align(Alignment.BottomCenter),
            primary = primary
        )
    }
}
@Composable
fun VigenciaCard(primary: Color) {
    Card {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("Vigencia", style = MaterialTheme.typography.titleMedium)

            Spacer(modifier = Modifier.height(12.dp))

            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                OutlinedTextField(
                    value = "12 Oct, 2023",
                    onValueChange = {},
                    label = { Text("Fecha inicio") },
                    modifier = Modifier.weight(1f)
                )
                OutlinedTextField(
                    value = "30 Oct, 2023",
                    onValueChange = {},
                    label = { Text("Fecha fin") },
                    modifier = Modifier.weight(1f)
                )
            }
        }
    }
}

@Composable
fun TiendaCard(primary: Color) {
    Card {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("Tienda", style = MaterialTheme.typography.titleMedium)
            Spacer(modifier = Modifier.height(12.dp))

            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Tienda 1",
                    style = MaterialTheme.typography.bodyLarge,
                    modifier = Modifier.weight(1f)
                )
                Text("▼", color = Color.Gray)
            }
        }
    }
}

@Composable
fun DetalleDescuentoCard(primary: Color) {
    Card {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("Detalles del Descuento", style = MaterialTheme.typography.titleMedium)

            Spacer(modifier = Modifier.height(12.dp))

            OutlinedTextField(
                value = "500",
                onValueChange = {},
                label = { Text("Umbral de precio") },
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(12.dp))

            OutlinedTextField(
                value = "15%",
                onValueChange = {},
                label = { Text("Valor del descuento") },
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
}

@Composable
fun PromoFooter(
    modifier: Modifier = Modifier,
    primary: Color
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Button(
            onClick = { /* guardar */ },
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp),
            colors = ButtonDefaults.buttonColors(containerColor = primary)
        ) {
            Text("Guardar Promoción", color = Color.White)
        }

        TextButton(
            onClick = { /* cancelar */ },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Cancelar y salir")
        }
    }
}

@Preview(showBackground = true)
@Composable
fun AgregarPromoScreenPreview() {
    MaterialTheme {
        AgregarPromoScreen()
    }
}