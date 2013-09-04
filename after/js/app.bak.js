(function($, _){
  'use strict';

  // jQuery handles to DOM objects
  var $containerNumber =         $('#container-number'),
      $searchContainerList =     $('#search-container-list'),
      $searchContainer =         $('#search-container'),
      $resultsContainer =        $('#results-container'),
      $additionalInfoContainer = $('#additional-info-container');

  // Add a container to the list of containers to search for
  $('#add-button').click(function(e){
    e.preventDefault();

    var containerNumber = $containerNumber.val().toUpperCase();
    if(containerNumber) {
      $searchContainerList.append('<option value="' + containerNumber + '">' + containerNumber + '</option>');
      $containerNumber.val('');
      $containerNumber.focus();
    }
  });

  // Remove container from the list of containers to search for
  $('#remove-button').click(function(e){
    e.preventDefault();


    if(confirm('Remove selected containers?')){
      _.each($searchContainerList.val(), function(value){
        $searchContainerList.find('option[value=' + value + ']').remove();
      });

      $containerNumber.focus();
    }
  });

  // Remove all containers from the list of containers to search for
  $('#reset-button').click(function(e){
    e.preventDefault();

    if(confirm('Remove all containers?')){
      $searchContainerList.empty();
      $containerNumber.focus();
    }
  });

  // Initiate search
  $('#search-button').click(function(e){
    e.preventDefault();

    if($searchContainerList.children().length) {
      var containerNumbers = [];
      _.each($searchContainerList.children(), function(option){
        var containerNumber = $(option).attr('value');
        containerNumbers.push(containerNumber);
      });

      searchFor(containerNumbers);
    }
  });

  // Hide search form and then continue search
  function searchFor(containerNumbers){
    $searchContainer.slideUp('fast',
      function(){
        performSearch(containerNumbers)
      });
  }

  // Continue search and display search results
  function performSearch(containerNumbers){
    $('#results-summary tbody').empty();
    $additionalInfoContainer.hide();

    var results = [];
    _.each(containerNumbers, function(containerNumber){
      var container = _.findWhere(data, {'Container': containerNumber});
      if(container){
        results.push(container);
      }
    });

    var html = '';

    _.each(results, function(result){
      html +=
        '<tr>' +
        '<td><a href="" class="results-container-number" data-container="' + result.Container + '">' + result.Container + '<a></td>' +
        '<td>' + result.Size + '</td>' +
        '<td>' + result.Vessel + '</td>' +
        '<td>' + result.Voyage + '</td>' +
        '<td>' + result.Owner + '</td>' +
        '<td>' + result.DischargeDate + '</td>' +
        '<td>' + result.Location + '</td>' +
        '<td>' + result.Activity + '</td>' +
        '<td>' + result.ActivityDate + '</td>' +
        '<td>' + result.ActivityLocation + '</td>' +
        '</tr>';
    });

    $('#results-summary tbody').append(html);

    $resultsContainer.slideDown('fast');
  }

  // A container in the search results has been clicked, display additional information
  function containerClicked(e){
    e.preventDefault();
    $('#results-summary td').removeClass('selected');
    $(e.target).parents('tr').children('td').addClass('selected');
    loadAdditionalInfo($(e.target).data('container'));
  }

  // Display additional information for the selected container
  function loadAdditionalInfo(containerNumber){
    $('#results-dwell-time tbody').empty();
    $('#results-movements tbody').empty();

    var container = _.findWhere(data, {'Container': containerNumber});
    if(container){
      $additionalInfoContainer.fadeOut('fast', function(){
        var dwell = container.DwellTime;
        if(dwell) {
          var html =
            '<tr>' +
              '<td>' + dwell.Container + '</td>' +
              '<td>' + dwell.DischargeDate + '</td>' +
              '<td>' + dwell.RampDate + '</td>' +
              '<td>' + dwell.DepartureDate + '</td>' +
              '<td>' + dwell.TermDwell + '</td>' +
              '<td>' + dwell.RailDwell + '</td>' +
              '<td>' + (dwell.TermDwell + dwell.RailDwell) + '</td>' +
            '</tr>';

          $('#results-dwell-time tbody').append(html);
        }

        var movements = container.Movements;
        if(movements) {
          var html = '';
          _.each(movements, function(movement){
            html +=
              '<tr>' +
                '<td>' + movement.Container + '</td>' +
                '<td>' + movement.From + '</td>' +
                '<td>' + movement.DepartureDate + '</td>' +
                '<td>' + movement.To + '</td>' +
                '<td>' + movement.ArrivalDate + '</td>' +
                '<td>' + movement.Car + '</td>' +
                '<td>' + movement.Train + '</td>' +
              '</tr>';
          });

          $('#results-movements tbody').append(html);
        }

        $additionalInfoContainer.fadeIn('fast');
      });
    }
  }

  // Display the search form again, allowing the user to modify their search
  $('#modify-button').click(function(e){
    e.preventDefault();
    $resultsContainer.slideUp('fast', function(){
      $searchContainer.slideDown('fast', function(){
        $containerNumber.focus();
      });
    });
  });

  // Display the search screen, initialized for a new search
  $('#new-button').click(function(e){
    e.preventDefault();
    if(confirm('Are you sure you want to reset your search?')){
      $searchContainerList.empty();
      $resultsContainer.slideUp('fast', function(){
        $searchContainer.slideDown('fast', function(){
          $containerNumber.focus();
        });
      });
    }
  });

  // Initialize on load
  $(function(){
    $containerNumber.focus();
    $('#results-summary').on('click', 'a.results-container-number', containerClicked);
  });
})(jQuery, _);