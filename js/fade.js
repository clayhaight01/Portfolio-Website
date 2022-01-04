$(document).ready(function() {
    
    $(window).scroll( function(){
    
        $('.overlay').each( function(i){
            
            var bottom_of_object_1 = $('.gearbox_fadein').position().top + $('.gearbox_fadein').outerHeight();
            var bottom_of_window = $(window).scrollTop() + $(window).height();
            
            if(bottom_of_window > bottom_of_object_1 ){
                $(this).animate({'opacity':'1'},100,"swing");         
            }
        }); 
        $('.overlay_2').each( function(i){
            
            var bottom_of_object_2 = $('.pcb_side').position().top + $('.pcb_side').outerHeight();
            var bottom_of_window = $(window).scrollTop() + $(window).height();
            
            if(bottom_of_window > bottom_of_object_2 ){
                $(this).animate({'opacity':'1'},100,"swing");         
            }
        });
    }); 
});