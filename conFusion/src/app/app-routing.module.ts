import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";
import { ReservationComponent } from './reservation/reservation.component';
import { MenuComponent } from "./menu/menu.component";
import { HomeComponent } from "./home/home.component";
import { DishdetailComponent } from './dishdetail/dishdetail.component';
import { AboutComponent } from "./about/about.component";
import { ContactComponent } from "./contact/contact.component";
import { FavoritesComponent } from './favorites/favorites.component';
import { UserAuthComponent } from './userauth/userauth.component';

const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "aboutus", component: AboutComponent},
    { path: "menu", component: MenuComponent },
    { path: "favorites", component: FavoritesComponent },
    { path: 'dishdetail/:id', component: DishdetailComponent },
    { path: "reservation", component: ReservationComponent },
    { path: 'contactus', component: ContactComponent},
    { path: "auth", component: UserAuthComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
