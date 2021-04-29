CREATE DATABASE ble_db;

CREATE TABLE actionresults
(
    id integer NOT NULL,
    result character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT actionresults_ids_pkey PRIMARY KEY (id)
);

Insert into actionresults (id, result) values (1, 'Operation Success');
Insert into actionresults (id, result) values (-1, 'User already registered');
Insert into actionresults (id, result) values (-2, 'Password must have more than 8 characters');
Insert into actionresults (id, result) values (-3, 'email and password does not match');
Insert into actionresults (id, result) values (-4, 'The added item is already exist');
Insert into actionresults (id, result) values (-5, 'Those corridors are already connected');
Insert into actionresults (id, result) values (-6, 'Device not exist');
Insert into actionresults (id, result) values (-7, 'Not authorize to complete this request');

CREATE TABLE actions
(
    id integer NOT NULL,
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT actions_ids_pkey PRIMARY KEY (id)
);

Insert into actions (id, name) VALUES (1, 'Registration');
Insert into actions (id, name) VALUES (2, 'SignIn');
Insert into actions (id, name) VALUES (3, 'RefreshToken');
Insert into actions (id, name) VALUES (4, 'CheckSensor');
Insert into actions (id, name) VALUES (5, 'GetAdmins');
Insert into actions (id, name) VALUES (6, 'AddAdmin');
Insert into actions (id, name) VALUES (7, 'ChangeAdminStatus');
Insert into actions (id, name) VALUES (8, 'AddBuilding');
Insert into actions (id, name) VALUES (9, 'ChangeBuildingStatus');
Insert into actions (id, name) VALUES (10, 'GetBuildings');
Insert into actions (id, name) VALUES (11, 'AddFloor');
Insert into actions (id, name) VALUES (12, 'ChangeFloorStatus');
Insert into actions (id, name) VALUES (13, 'GetFloors');
Insert into actions (id, name) VALUES (14, 'AddCorridor');
Insert into actions (id, name) VALUES (15, 'ChangeCorridorStatus');
Insert into actions (id, name) VALUES (16, 'GetCorridors');
Insert into actions (id, name) VALUES (17, 'AddCorridorConnection');
Insert into actions (id, name) VALUES (18, 'RemoveCorridorConnection');
Insert into actions (id, name) VALUES (19, 'GetCorridorConnections');
Insert into actions (id, name) VALUES (20, 'GetFullCorridorConnections');
Insert into actions (id, name) VALUES (21, 'AddRoom');
Insert into actions (id, name) VALUES (22, 'ChangeRoomStatus');
Insert into actions (id, name) VALUES (23, 'GetRooms');
Insert into actions (id, name) VALUES (24, 'GetAllUsers');
Insert into actions (id, name) VALUES (25, 'getUsersDevices');

CREATE TABLE Building
(
    id character varying(100) COLLATE pg_catalog."default" NOT NULL,
    Name character varying(50) NOT NULL,
    isactive integer NOT NULL DEFAULT 1,
    CONSTRAINT Building_ids_pkey PRIMARY KEY (id)
);

CREATE TABLE floor
(
    id character varying(100) COLLATE pg_catalog."default" NOT NULL,
    building_id character varying(100) COLLATE pg_catalog."default" NOT NULL,
    "number" integer NOT NULL,
    isactive integer NOT NULL DEFAULT 1,
    name character varying(30) COLLATE pg_catalog."default",
    CONSTRAINT floor_ids_pkey PRIMARY KEY (id),
    CONSTRAINT "BF_KF" FOREIGN KEY (building_id)
        REFERENCES building (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

CREATE TABLE notifications
(
    id character varying(100) COLLATE pg_catalog."default" NOT NULL,
    title character varying(50) COLLATE pg_catalog."default" NOT NULL,
    text character varying(50) COLLATE pg_catalog."default" NOT NULL,
    creation_date timestamp(4) with time zone NOT NULL DEFAULT now(),
    CONSTRAINT notifications_ids_pkey PRIMARY KEY (id)
);

CREATE TABLE corridor
(
    id character varying(100) COLLATE pg_catalog."default" NOT NULL,
    floorid character varying(100) COLLATE pg_catalog."default" NOT NULL,
    number integer NOT NULL,
    isactive integer NOT NULL DEFAULT 1,
    maxquantity integer NOT NULL DEFAULT 20,
    name character varying(30) COLLATE pg_catalog."default",
    CONSTRAINT corridor_ids_pkey PRIMARY KEY (id),
    CONSTRAINT "CF_FK" FOREIGN KEY (floorid)
        REFERENCES public.floor (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

CREATE TABLE Corridor_Connection
(
    FromCorridor character varying(100) COLLATE pg_catalog."default" NOT NULL,
    ToCorridor character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "FCC_FK" FOREIGN KEY (FromCorridor)
        REFERENCES public.corridor (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
	CONSTRAINT "TCC_FK" FOREIGN KEY (ToCorridor)
        REFERENCES public.corridor (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

CREATE TABLE rooms
(
    id character varying(100) COLLATE pg_catalog."default" NOT NULL,
    corridorid character varying(100) COLLATE pg_catalog."default" NOT NULL,
    roomnumber integer NOT NULL,
    isactive integer NOT NULL DEFAULT 1,
    roomtype character varying(10) COLLATE pg_catalog."default" NOT NULL DEFAULT 'Room'::character varying,
    maxquantity integer NOT NULL DEFAULT 20,
    name character varying(30) COLLATE pg_catalog."default",
    CONSTRAINT rooms_ids_pkey PRIMARY KEY (id),
    CONSTRAINT "RC_FK" FOREIGN KEY (corridorid)
        REFERENCES public.corridor (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

CREATE TABLE users
(
    id character varying(100) COLLATE pg_catalog."default" NOT NULL,
    fname character varying(50) COLLATE pg_catalog."default" NOT NULL,
    lname character varying(50) COLLATE pg_catalog."default" NOT NULL,
    email character varying(50) COLLATE pg_catalog."default" NOT NULL,
    password character varying(250) COLLATE pg_catalog."default" NOT NULL,
    creation_date timestamp(4) with time zone NOT NULL DEFAULT now(),
    CONSTRAINT users_ids_pkey PRIMARY KEY (id)
);

CREATE TABLE users_devices
(
    id character varying(100) COLLATE pg_catalog."default" NOT NULL,
    userid character varying(100) COLLATE pg_catalog."default" NOT NULL,
    deviceid character varying(100) COLLATE pg_catalog."default" NOT NULL,
    isdeleted integer NOT NULL DEFAULT 0,
    creation_date timestamp(4) with time zone NOT NULL DEFAULT now(),
    changed_date timestamp(4) with time zone,
    CONSTRAINT usersdevices_ids_pkey PRIMARY KEY (id),
    CONSTRAINT "UUD_FK" FOREIGN KEY (userid)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

CREATE TABLE notifications_tokens
(
    token character varying(100) COLLATE pg_catalog."default" NOT NULL,
    userdeviceid character varying(100) COLLATE pg_catalog."default" NOT NULL,
    isdeleted integer NOT NULL DEFAULT 0,
    creation_date timestamp(4) with time zone NOT NULL DEFAULT now(),
    changed_date timestamp(4) with time zone,
    CONSTRAINT notifications_tokens_ids_pkey PRIMARY KEY (token),
    CONSTRAINT "UDNT_FK" FOREIGN KEY (userdeviceid)
        REFERENCES public.users_devices (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

CREATE TABLE refreshtoken
(
    userid character varying(100) COLLATE pg_catalog."default" NOT NULL,
    refreshtoken character varying(400) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "RTU_FK" FOREIGN KEY (userid)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

CREATE TABLE sensorentity
(
    id character varying(100) COLLATE pg_catalog."default" NOT NULL,
    entityid character varying(100) COLLATE pg_catalog."default" NOT NULL,
    entitytype character varying(30) COLLATE pg_catalog."default" NOT NULL,
    currentquantity integer NOT NULL DEFAULT 0,
    CONSTRAINT sensorentity_pkey PRIMARY KEY (id)
);

CREATE TABLE sensorlog
(
    userdeviceid character varying(100) COLLATE pg_catalog."default" NOT NULL,
    SesorEntityID character varying(100) COLLATE pg_catalog."default" NOT NULL,
    actionid integer NOT NULL,
    resultid integer NOT NULL,
    params character varying(255) COLLATE pg_catalog."default",
    actiondate timestamp(4) with time zone NOT NULL DEFAULT now(),
    CONSTRAINT "SLA_FK" FOREIGN KEY (actionid)
        REFERENCES public.actions (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "SLRE_FK" FOREIGN KEY (resultid)
        REFERENCES public.actionresults (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "SLRO_FK" FOREIGN KEY (SesorEntityID)
        REFERENCES public.sensorentity (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "SLUD_FK" FOREIGN KEY (userdeviceid)
        REFERENCES public.users_devices (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

CREATE TABLE useractions
(
    userid character varying(50) COLLATE pg_catalog."default",
    actionid integer NOT NULL,
    resultid integer NOT NULL,
    params character varying(500) COLLATE pg_catalog."default",
    actiondate timestamp(4) with time zone NOT NULL DEFAULT now(),
    CONSTRAINT "UAAR_FK" FOREIGN KEY (resultid)
        REFERENCES public.actionresults (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "UAA_FK" FOREIGN KEY (actionid)
        REFERENCES public.actions (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "UAU_FK" FOREIGN KEY (userid)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

CREATE TABLE users_notifications
(
    usersid character varying(50) COLLATE pg_catalog."default",
    notificationsid character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "NN_FK" FOREIGN KEY (notificationsid)
        REFERENCES public.notifications (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "NU_FK" FOREIGN KEY (usersid)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

CREATE TABLE administrators
(
    id character varying(100) COLLATE pg_catalog."default" NOT NULL,
    username character varying(50) COLLATE pg_catalog."default" NOT NULL,
    password character varying(250) COLLATE pg_catalog."default" NOT NULL,
    creation_date timestamp(4) with time zone NOT NULL DEFAULT now(),
    isactive integer NOT NULL DEFAULT 1,
    CONSTRAINT admins_ids_pkey PRIMARY KEY (id)
);

CREATE TABLE adminactions
(
    adminid character varying(100) COLLATE pg_catalog."default",
    actionid integer NOT NULL,
    resultid integer NOT NULL,
    params character varying(500) COLLATE pg_catalog."default",
    actiondate timestamp(4) with time zone NOT NULL DEFAULT now(),
    CONSTRAINT "AAAC_FK" FOREIGN KEY (actionid)
        REFERENCES public.actions (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "AAAD_FK" FOREIGN KEY (adminid)
        REFERENCES public.administrators (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "AAAR_FK" FOREIGN KEY (resultid)
        REFERENCES public.actionresults (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE admins_refreshtokens
(
    adminid character varying(100) COLLATE pg_catalog."default" NOT NULL,
    refreshtoken character varying(400) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "ARF_FK" FOREIGN KEY (adminid)
        REFERENCES public.administrators (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

CREATE TABLE dw_sensor
(
    id character varying(100) COLLATE pg_catalog."default" NOT NULL,
    floorid character varying(100) COLLATE pg_catalog."default",
    type character varying(30) COLLATE pg_catalog."default",
    CONSTRAINT "DW_S_PK" PRIMARY KEY (id),
    CONSTRAINT "DW_SF_FK" FOREIGN KEY (floorid)
        REFERENCES public.floor (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

CREATE TABLE dw_numberofusers
(
    sensorid character varying(100) COLLATE pg_catalog."default",
    numberofusers integer NOT NULL,
    actiondate timestamp with time zone NOT NULL,
    CONSTRAINT "DW_SS_FK" FOREIGN KEY (sensorid)
        REFERENCES public.dw_sensor (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

-- PROCEDURE: public.insertdata()

-- DROP PROCEDURE public.insertdata();

CREATE OR REPLACE PROCEDURE insertdata(
	)
LANGUAGE 'plpgsql'

AS $BODY$DECLARE
	v_data RECORD;
	v_count integer:=0;
	v_floorId character varying(100);
Begin
	for v_data in (select se.id, se.entityId, se.entitytype, DATE_TRUNC('hour',sl.actiondate) as currentdate, count(distinct sl.userdeviceid) as numberOfUsers
					from sensorlog sl, sensorentity se
					where sl.sesorentityid = se.id
					and se.entitytype in ('Room', 'Entrance', 'Corridor')
					and sl.resultid = 1
					and DATE_TRUNC('hour',sl.actiondate) < DATE_TRUNC('hour',current_timestamp) - interval '1 hour'
					group by se.id, se.entityId, se.entitytype, currentdate) LOOP
	
	SELECT COUNT(*) INTO v_count
	FROM dw_sensor dws
	WHERE dws.id = v_data.id;
	
	if v_count > 0 then
		INSERT INTO dw_numberofusers (sensorid, numberofusers, actiondate)
		VALUES (v_data.id, v_data.numberOfUsers, v_data.currentdate);
	else
		if v_data.entitytype = 'Corridor' then
			SELECT cc.floorid INTO v_floorId
			FROM Corridor cc
			WHERE cc.id = v_data.entityId;
		else
			SELECT cc.floorid INTO v_floorId
			FROM Rooms r, Corridor cc
			WHERE r.corridorid = cc.id
			AND r.id = v_data.entityId;
		end if;
		
		INSERT INTO dw_sensor (id, floorid, type)
		VALUES (v_data.id, v_floorId, v_data.entitytype);
		
		INSERT INTO dw_numberofusers (sensorid, numberofusers, actiondate)
		VALUES (v_data.id, v_data.numberOfUsers, v_data.currentdate);
	end if;
	
	End LOOP;
	
	Commit;
End;$BODY$;

-- PROCEDURE: public.insert_data_normally()

-- DROP PROCEDURE public.insert_data_normally();

CREATE OR REPLACE PROCEDURE insert_data_normally(
	)
LANGUAGE 'plpgsql'

AS $BODY$DECLARE
	v_data RECORD;
	v_count integer:=0;
	v_floorId character varying(100);
Begin
	for v_data in (select se.id, se.entityId, se.entitytype, DATE_TRUNC('hour',sl.actiondate) as currentdate, count(distinct sl.userdeviceid) as numberOfUsers
					from sensorlog sl, sensorentity se
					where sl.sesorentityid = se.id
					and se.entitytype in ('Room', 'Entrance', 'Corridor')
					and sl.resultid = 1
					and DATE_TRUNC('hour',sl.actiondate) = DATE_TRUNC('hour',current_timestamp) - interval '1 hour'
					group by se.id, se.entityId, se.entitytype, currentdate) LOOP
	
	SELECT COUNT(*) INTO v_count
	FROM dw_sensor dws
	WHERE dws.id = v_data.id;
	
	if v_count > 0 then
		INSERT INTO dw_numberofusers (sensorid, numberofusers, actiondate)
		VALUES (v_data.id, v_data.numberOfUsers, v_data.currentdate);
	else
		if v_data.entitytype = 'Corridor' then
			SELECT cc.floorid INTO v_floorId
			FROM Corridor cc
			WHERE cc.id = v_data.entityId;
		else
			SELECT cc.floorid INTO v_floorId
			FROM Rooms r, Corridor cc
			WHERE r.corridorid = cc.id
			AND r.id = v_data.entityId;
		end if;
		
		INSERT INTO dw_sensor (id, floorid, type)
		VALUES (v_data.id, v_floorId, v_data.entitytype);
		
		INSERT INTO dw_numberofusers (sensorid, numberofusers, actiondate)
		VALUES (v_data.id, v_data.numberOfUsers, v_data.currentdate);
	end if;
	
	End LOOP;
	
	Commit;
End;$BODY$;