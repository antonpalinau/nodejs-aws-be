insert into product(title, description, price) values
	('S-ALBYEL-X4', 'Tie-dyed hoodie with logo embroidery', 137.00),
	('S-DESE MID CUT', 'High-top sneakers in washed nylon', 89.00),
	('S-DESE ML', 'High-top sneakers in nylon and leather', 95.00),
	('S-BRENTHA DEC', 'Slip-on sneakers in mix materials', 179.00),
	('W-RUSSELL', 'Hooded quilted down jacket', 269.00),
	('T-POLO-WORKY', 'Polo shirt with Mohawk patch', 59.00),
	('TASSYO', 'Cross-body in leather and coated denim', 119.00),
	('K-CROFT', 'Pullover with Mohawk logo', 119.00)

insert into stock (product_id, count) values
	((select id from product where title = 'S-ALBYEL-X4'), 5),
	((select id from product where title = 'S-DESE MID CUT'), 8),
	((select id from product where title = 'S-DESE ML'), 2),
	((select id from product where title = 'S-BRENTHA DEC'), 3),
	((select id from product where title = 'W-RUSSELL'), 15),
	((select id from product where title = 'T-POLO-WORKY'), 7),
	((select id from product where title = 'TASSYO'), 9),
	((select id from product where title = 'K-CROFT'), 6)
    