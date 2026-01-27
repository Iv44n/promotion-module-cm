package com.example.moduloventa.view.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.example.moduloventa.view.navigation.DrawerOption


import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.LocalOffer
import androidx.compose.material.icons.filled.PointOfSale
import androidx.compose.material3.Icon
import androidx.compose.ui.Alignment

@Composable
fun AppDrawer(
    onOptionSelected: (DrawerOption) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .background(Color(0xFF4AAAA5))
    ) {
        DrawerItem(
            icon = Icons.Default.PointOfSale,
            text = "Punto de venta",
            onClick = { onOptionSelected(DrawerOption.PUNTO_VENTA) }
        )

        DrawerItem(
            icon = Icons.Default.LocalOffer,
            text = "Promociones",
            onClick = { onOptionSelected(DrawerOption.PROMOS) }
        )
    }
}
@Composable
private fun DrawerItem(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    text: String,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(horizontal = 24.dp, vertical = 20.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = text,
            tint = Color.White,
            modifier = Modifier.size(28.dp)
        )

        Spacer(modifier = Modifier.width(20.dp))

        Text(
            text = text,
            style = MaterialTheme.typography.titleMedium,
            color = Color.White
        )
    }
}

//        Text(
//            text = "Punto de venta",
//            style = MaterialTheme.typography.titleMedium,
//            modifier = Modifier
//                .clickable { onOptionSelected(DrawerOption.PUNTO_VENTA) }
//                .padding(vertical = 12.dp)
//        )
//
//        Text(
//            text = "Promociones",
//            style = MaterialTheme.typography.titleMedium,
//            modifier = Modifier
//                .clickable { onOptionSelected(DrawerOption.PROMOS) }
//                .padding(vertical = 12.dp)
//        )
//    }
//}