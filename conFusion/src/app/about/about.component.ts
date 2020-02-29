import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { LeaderService } from '../services/leader.service';
import { Leader } from '../shared/leader';
import { DrawerPage } from '../shared/drawer/drawer.page';

@Component({
    selector: 'app-about',
    moduleId: module.id,
    templateUrl: './about.component.html'
})
export class AboutComponent extends DrawerPage implements OnInit {
    leaders: Leader[];
    errMess: string;
    constructor(private changeDetectorRef: ChangeDetectorRef,
        private leaderService: LeaderService,
        @Inject('baseURL') public baseURL
    ) {
        super(changeDetectorRef);
    }

    ngOnInit() {
        this.leaderService
            .getLeaders()
            .subscribe(
                leader => (this.leaders = leader),
                errmess => (this.errMess = <any>errmess)
            );
    }
}