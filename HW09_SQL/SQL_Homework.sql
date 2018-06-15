use sakila;

# 1a. Display the first and last names of all acgors from the table actor.
select first_name, last_name
from actor;

# 1b. Display the first and last name of each actor in a single column in upper case letters.
#     Name the column Actor Name.
select concat_ws(' ', first_name, last_name) as "Actor_Name"
from actor;

# 2a. You need to find the ID number, first name, and last name of an actor, of whom you know 
#	  only the first name, "Joe."  What query would you use to obtain this information?
select actor_id, first_name, last_name
from actor
where first_name = 'Joe';

# 2b. Find all actors whose last name contain the letters GEN.
select actor_id, first_name, last_name
from actor
where last_name like '%GEN%';

#2c. Find all actors whose last names contain the letters LI.  This time, order the rows by
#.   last name and first name, in that order.
select first_name, last_name
from actor
where last_name like '%LI%'
order by last_name;

#2d. Using IN, display the country_id and country columns of the following countries:
#.   Afghanistan, Bangladesh, and China.
select country_id, country
from country
where country in ('Afghanistan', 'Bangladesh', 'China');

#3a. Add a middle_name column to the table actor.  Position in between first_name and
#    last_name.
alter table actor
add column middle_name varchar(50) after first_name;
select * from actor;

#3b. You realize that some of these actors have tremendously long last names.  Change the 
#.   data type of the middle_name column to blobs.
alter table actor
modify column middle_name blob;

#3c. Now delete the middle_name column.
alter table actor
drop column middle_name;
select * from actor;

#4a. List the last names of actors, as well as how many actors have that last name.
select last_name, count(last_name) as number
from actor
group by last_name;

#4b. List last names of actors and the number of actors who have that last name, but only
#    for names that are shared by at least two actors.
select last_name, count(last_name) as number_of_actors
from actor
group by last_name
having count(last_name) > 2;

#4c. The actor HARPO WILLIAMS was accidentally entered int eh actor table as GROUCHO WIllIAMS,
#.   the name of Harpo's second cousin's husband's yoga teacher.  Write a query to fix the record.
update actor
set first_name = "HARPO"
where first_name = "GROUCHO" and last_name = "WILLIAMS";

#4d. Perhaps we were too hasty in changing GROUCHO to HARPO.  It turns out that GROUCHO was the
#.   the correct name after all!  In a single query, if the first name of the actor is currently
#.   HARPO, change it to GROUCHO.  Otherwise, change the first name to MUCHO GROUCHO, as that is
#.   exactly what the actor will be with the grievous error.  BE CAREFUL NOT TO CHANGE THE FIRST
#.   NAME OF EVERY ACTOR TO MUCHO GROUCHO!
update actor
set first_name = "GROUCHO"
where first_name = "HARPO" and last_name = "WILLIAMS";

#5a. You cannot locate the chema of the address table.  Which query would you use to recreate it?
show create table address;

#6a. Use JOIN to display the first and last names, as well as the address, of each staff member.
#.   Use the tables staff and address.
select staff.first_name, staff.last_name, address.address
from staff
join address on address.address_id = staff.address_id;

#6b. Use JOIN to display the total amount rung up by each staff member in August 2005.  Use staff
#.   and payment.
select staff.first_name, staff.last_name, sum(payment.amount) as total_payment
from staff
join payment on payment.staff_id = staff.staff_id
where month(payment.payment_date)=08 and  year(payment.payment_date)=2005
group by staff.staff_id;

#6c. List each film and the number of actors who are listed for that film.  Use tables film_actor
#.   and film.  Use inner join.
select film.title, count(film_actor.actor_id) as number_of_actors
from film
inner join film_actor on film.film_id = film_actor.film_id
group by film_actor.film_id;

#6d. How many copies of the film HUNCHBACK IMPOSSIBLE exist in the inventory system?
select count(inventory_id)
from inventory
where film_id in
	(
    select film_id
    from film
    where title = 'Hunchback Impossible'
    );
    
#6e. Using the tables PAYMENT and CUSTOMER and the join command, list the total paid by 
#    each customer.  List the customers alphabetically by last name.
select customer.first_name, customer.last_name, sum(payment.amount) as total_paid
from payment
join customer on customer.customer_id = payment.customer_id
group by payment.customer_id
order by customer.last_name;

#7a. The music of Queen and Kris Kristofferson have seen an unlikely resurgence.  As an
#.   unintended consequence, films starting with the letters K and Q have also soared in
#.   in popularity.  Use subqueries to display the titles of movies starting with the
#.   letters K and Q whose language is English.
select title
from film
where language_id in
	(
    select language_id
    from language
    where name = 'English'
    )
and title like 'K%' or title like 'Q%';

#7b. Use subqueries to display all actors who appear in the film ALONE TRIP.
select first_name, last_name
from actor
where actor_id in
	(
    select actor_id
    from film_actor
    where film_id in
		(
        select film_id
        from film
        where title = 'Alone Trip'
        )
	);
    
#7c. You want to run an email marketing campaign in Canada, for which you will need
#.   the names and email addresses of all Canadian customers.  Use joins to retrieve
#.   this information.
select 	customer.first_name as 'first_name', 
		customer.last_name as 'last_name', 
        customer.email as 'email', 
        country.country as 'country'
from customer
	join address on address.address_id = customer.address_id
	join city on address.city_id = city.city_id
	join country on city.country_id = country.country_id
where country.country = 'Canada';

#7d. Sales have been lagging amoung young families, and you wish to target all family
#.   movies for a promotion.  Identify all movies categorized as family films.
select title
from film
where film_id in
	(
    select film_id
    from film_category
    where category_id in
		(
        select category_id
        from category
        where name = 'family'
        )
	);

#7e. Display the most frequently rented movies in descending order.
select film.title, count(film.title) as number_rentals
from film
	join inventory on film.film_id = inventory.film_id
    join rental on inventory.inventory_id = rental.inventory_id
group by film.title
order by number_rentals desc;

#7f. Write a query to display how much business, in dollars, each store brought in.
select inventory.store_id, sum(payment.amount) as revenue
from inventory
	join rental on inventory.inventory_id = rental.inventory_id
    join payment on rental.customer_id = payment.customer_id
group by inventory.store_id;

#7g. Write a query to display for each store its storeID, city, and country.
select store.store_id, city.city, country.country
from store
	join address on store.address_id = address.address_id
    join city on city.city_id = address.city_id
    join country on country.country_id = city.country_id;

#7h. List the top five genres in gross revenue in descending order.  (Hint: you may
#.   need to use the following tables: category, film_category, inventory, payment
#.   and rental
select category.name, sum(payment.amount) as total
from payment
	join rental on payment.customer_id = rental.customer_id
    join inventory on rental.inventory_id = inventory.inventory_id
    join film_category on inventory.film_id = film_category.film_id
    join category on film_category.category_id = category.category_id
group by category.category_id
order by total desc
limit 5;

#8a. In your new role as an executive, you would like to have an easy way of viewing
#.   the Top five genres by gross revenue.  Use the solution from the problem above
#.   to create a view.  
create view top_five_genres as
	select category.name, sum(payment.amount) as total
	from payment
		join rental on payment.customer_id = rental.customer_id
		join inventory on rental.inventory_id = inventory.inventory_id
		join film_category on inventory.film_id = film_category.film_id
		join category on film_category.category_id = category.category_id
	group by category.category_id
	order by total desc
	limit 5;

#8b. How would you display the view you created in 8a?
select * from top_five_genres;

#8c. You find that you no longer need the view top_five_genres.  Write a query to delete it.
drop view top_five_genres;























