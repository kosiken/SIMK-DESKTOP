import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MyMaterialModuleModule } from './my-material-module/my-material-module.module';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { LeagueService, ElectronService, WindowService } from './providers';
// import { } from './providers/window.service';
import { WebviewDirective } from './directives/webview.directive';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
// import { SelectorLeagueComponent } from './components/selector-league/selector-league.component';
import { ListTeamComponent } from './components/list-team/list-team.component';
import { LeagueDashboardComponent } from './components/league-dashboard/league-dashboard.component';

import { PlayerComponent } from './components/player/player.component';
import { SvgCircleComponent } from './components/svg-circle/svg-circle.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TeamDashboardComponent } from './components/team-dashboard/team-dashboard.component';
import { StandingsComponent } from './components/standings/standings.component';
// import {} from './providers';
import { AboutComponent } from './pages/about/about.component';
import { ToolComponent } from './tools/tool/tool.component';
import { FixtureComponent } from './components/fixture/fixture.component';
import { StoreModule } from '@ngrx/store';
import { AppReducers } from './store/reducers';
import { BottomBarComponent } from './components/bottom-bar/bottom-bar.component';
import { TeamComponent } from './components/team/team.component';
import { MessagesComponent } from './components/messages/messages.component';
import { StatsComponent } from './components/stats/stats.component';
import { PlayerStatComponent } from './components/player-stat/player-stat.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebviewDirective,

    ListTeamComponent,
    LeagueDashboardComponent,
    TeamDashboardComponent,

    PlayerComponent,
    SvgCircleComponent,

    StandingsComponent,
    AboutComponent,
    ToolComponent,
    FixtureComponent,
    BottomBarComponent,
    TeamComponent,
    MessagesComponent,
    StatsComponent,
    PlayerStatComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MyMaterialModuleModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    DragDropModule,
    MarkdownModule.forRoot(),
    StoreModule.forRoot(AppReducers)
  ],
  providers: [ElectronService, WindowService, LeagueService],
  bootstrap: [AppComponent]
})
export class AppModule {}
