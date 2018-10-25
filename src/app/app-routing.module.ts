import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { ScalesComponent } from "./scales/scales.component";

const routes: Routes = [{
  path: "home",
  component: HomeComponent
}, {
  path: "scales",
  component: ScalesComponent
}, {
  path: "",
  redirectTo: "/home",
  pathMatch: "full"
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const RoutingComponents = [
  HomeComponent,
  ScalesComponent
];
