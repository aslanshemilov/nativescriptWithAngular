import { Component, OnInit, Inject, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { TextField } from 'tns-core-modules/ui/text-field';
import { Switch } from 'tns-core-modules/ui/switch';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ModalDialogService, ModalDialogOptions, ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { ReservationModalComponent } from "../reservationmodal/reservationmodal.component";
import { View, Page } from 'tns-core-modules/ui/page/page';
import { CouchbaseService } from '../services/couchbase.service';
import * as enums from 'tns-core-modules/ui/enums';
import { RadSideDrawer } from 'nativescript-telerik-ui/sidedrawer';
import * as app from "tns-core-modules/application";

@Component({
    selector: 'app-reservation',
    moduleId: module.id,
    templateUrl: './reservation.component.html',
    styleUrls: ['./rservation.component.css']
})
export class ReservationComponent implements OnInit {
    reservation: FormGroup;
    showSubmission: boolean = false;
    formView: View;
    submissionView: View;
    reservationSubmission: any;
    reservations: Reservation[];
    docId: string = 'reservations';

    constructor(private formBuilder: FormBuilder,
        private modalService: ModalDialogService,
        private couchbaseService: CouchbaseService,
        private page: Page,
        private vcRef: ViewContainerRef) {
        this.reservation = this.formBuilder.group({
            guests: 3,
            smoking: false,
            dateTime: ['', Validators.required]
        });
        this.reservationSubmission = {
            guests: 3,
            smoking: 'No',
            dateTime: ''
        };
    }

    ngOnInit() { }

    createModalView(args) {
        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: args,
            fullscreen: false
        };

        this.modalService.showModal(ReservationModalComponent, options)
            .then((result: any) => {
                if (args === "guest") {
                    this.reservation.patchValue({guests: result});
                } else if (args === "date-time") {
                    this.reservation.patchValue({ dateTime: result });
                }
            })
    }

    onSmokingChecked(args) {
        let smokingSwitch = <Switch>args.object;
        if (smokingSwitch.checked) {
            this.reservation.patchValue({ smoking: true });
        } else {
            this.reservation.patchValue({ smoking: false });
        }
    }

    onGuestChange(args) {
        let textField = <TextField>args.object;
        this.reservation.patchValue({ guests: textField.text });
    }

    onDateTimeChange(args) {
        let textField = <TextField>args.object;
        this.reservation.patchValue({ dateTime: textField.text });
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    onSubmit() {
        this.reservationSubmission = this.reservation.value;
        let doc = this.couchbaseService.getDocument(this.docId);
        if (doc == null) {
            this.couchbaseService.createDocument(
                { reservations: [this.reservationSubmission] },
                this.docId
            );
        } else {
            this.reservations = doc.reservations;
            this.reservations.push(this.reservationSubmission);
            this.couchbaseService.updateDocument(this.docId, {
                reservations: this.reservations
            });
        }

        if (this.reservationSubmission.smoking) {
            this.reservationSubmission.smoking = 'Yes';
        } else {
            this.reservationSubmission.smoking = 'No';
        }
        this.animateForm();
        console.log(JSON.stringify(this.reservation.value));
    }

    animateForm() {
        this.formView = this.page.getViewById<View>('formView');
        this.formView.animate({
            target: this.formView,
            scale: { x: 0,  y: 0 },
            translate: { x: 0, y: -2000 },
            opacity: 1,
            duration: 500,
            curve: enums.AnimationCurve.easeIn
        });
        this.submissionView = this.page.getViewById<View>('submissionView');
        this.submissionView.animate({
            scale: { x: 1, y: 1 },
            translate: { x: 0, y: 0 },
            opacity: 1,
            duration: 2500,
            curve: enums.AnimationCurve.easeIn
        });
        this.showSubmission = true;
    }
}